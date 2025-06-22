import { exec } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import util from "node:util";
import createCustomLogger from "@squaredmade/logger";
import dotenv from "dotenv";
import { Client } from "pg";

dotenv.config();

const execPromise = util.promisify(exec);
const logger = createCustomLogger("seed");

// biome-ignore lint/style/noProcessEnv: We need these to seed the database
const remoteDbUrl = process.env.REMOTE_DATABASE_URL;
// biome-ignore lint/style/noProcessEnv: We need these to seed the database
const localDbUrl = process.env.DATABASE_URL;

// Check if Docker is installed
async function checkDockerInstallation() {
	try {
		await execPromise("docker --version");
		logger.info("Docker is installed");
		return true;
	} catch {
		logger.error("Docker is not installed. Please install Docker to continue.");
		return false;
	}
}

// Check if Docker Compose is installed
async function checkDockerComposeInstallation() {
	try {
		await execPromise("docker compose version");
		logger.info("Docker Compose is installed");
		return true;
	} catch {
		logger.error(
			"Docker Compose is not installed. Please install Docker Compose to continue.",
		);
		return false;
	}
}

// Start Docker containers for PostgreSQL
async function startDockerDatabase() {
	try {
		logger.info("Starting PostgreSQL in Docker...");
		const { stdout } = await execPromise(
			"docker compose -f docker-compose.yml up -d",
		);
		logger.info("Docker database started");
		logger.debug(stdout);

		// Wait for PostgreSQL to be ready
		await waitForPostgresReady(30); // Wait up to 30 seconds
		return true;
	} catch (error) {
		logger.error("Failed to start Docker database:", error);
		return false;
	}
}

// Wait for PostgreSQL to be ready to accept connections
async function waitForPostgresReady(maxAttempts = 30) {
	logger.info("Waiting for PostgreSQL to be ready...");

	const connectionString =
		// biome-ignore lint/style/noProcessEnv: we need to connect to the local database
		process.env.DOCKER_POSTGRES_URL ||
		"postgres://postgres:postgres@localhost:5432/squared-test";

	const attemptConnection = async (attempt: number): Promise<boolean> => {
		try {
			const client = new Client({
				connectionString,
			});

			await client.connect();
			await client.query("SELECT 1");
			await client.end();

			logger.info("PostgreSQL is ready");
			return true;
		} catch {
			if (attempt >= maxAttempts) {
				logger.error(
					"PostgreSQL failed to become ready within the timeout period",
				);
				throw new Error("PostgreSQL connection timeout");
			}

			logger.debug(
				`Waiting for PostgreSQL... (attempt ${attempt}/${maxAttempts})`,
			);

			// Wait for 1 second before the next attempt
			await new Promise((resolve) => setTimeout(resolve, 1000));
			return attemptConnection(attempt + 1);
		}
	};

	return await attemptConnection(1);
}

async function dumpAndRestore() {
	if (!(remoteDbUrl && localDbUrl)) {
		throw new Error("Database URLs are not set in environment variables");
	}

	logger.info("Starting database dump and restore process...");

	const dumpFilePath = path.resolve(process.cwd(), "database_dump.pg");

	try {
		// Check for Docker installation
		const isDockerInstalled = await checkDockerInstallation();
		const isDockerComposeInstalled = await checkDockerComposeInstallation();

		if (!(isDockerInstalled && isDockerComposeInstalled)) {
			throw new Error("Docker or Docker Compose is not available");
		}

		// Start Docker database
		const isDbStarted = await startDockerDatabase();
		if (!isDbStarted) {
			throw new Error("Failed to start PostgreSQL in Docker");
		}

		// Dump the remote database
		logger.info("Dumping remote database...");
		await execPromise(
			`pg_dump --format=c --no-owner --no-acl ${remoteDbUrl} > ${dumpFilePath}`,
		);
		logger.info("Remote database dump completed.");

		// Restore to the local database
		logger.info("Restoring to local database...");
		await execPromise(
			`pg_restore --clean --if-exists --no-owner --no-acl -d ${localDbUrl} ${dumpFilePath}`,
		);
		logger.info("Database restore completed successfully.");

		// Clean up the dump file
		fs.unlinkSync(dumpFilePath);
		logger.info("Temporary dump file removed.");
	} catch (error) {
		logger.error("An error occurred:", error);
		throw error;
	}
}

// Function to check if pg_dump and pg_restore are available in Docker
async function checkPgToolsInDocker() {
	try {
		logger.info("Checking PostgreSQL tools in Docker...");

		// Create a helper script to check for pg_dump and pg_restore
		const pgToolsScript = `
    #!/bin/bash
    if command -v pg_dump >/dev/null 2>&1 && command -v pg_restore >/dev/null 2>&1; then
      echo "PostgreSQL tools are available"
      exit 0
    else
      echo "PostgreSQL tools are not available"
      exit 1
    fi
    `;

		const scriptPath = path.resolve(process.cwd(), "check_pg_tools.sh");
		fs.writeFileSync(scriptPath, pgToolsScript, { mode: 0o755 });

		try {
			await execPromise(
				`docker run --rm -v ${scriptPath}:/check_pg_tools.sh postgres:17 /check_pg_tools.sh`,
			);
			logger.info("PostgreSQL tools are available in Docker");
			return true;
		} finally {
			// Clean up the script file
			fs.unlinkSync(scriptPath);
		}
	} catch (error) {
		logger.error("PostgreSQL tools are not available in Docker", error);
		return false;
	}
}

// Function to use Docker for pg_dump and pg_restore operations
async function dumpAndRestoreWithDocker() {
	if (!(remoteDbUrl && localDbUrl)) {
		throw new Error("Database URLs are not set in environment variables");
	}

	logger.info("Starting database dump and restore process using Docker...");

	try {
		// Create a Docker volume to store the dump file
		await execPromise("docker volume create pg_dump_vol");

		// Dump the remote database using Docker
		logger.info("Dumping remote database using Docker...");
		await execPromise(
			`docker run --rm -v pg_dump_vol:/dump postgres:17 pg_dump --format=c --no-owner --no-acl "${remoteDbUrl}" -f /dump/database_dump.pg`,
		);
		logger.info("Remote database dump completed with Docker.");

		// Restore to the local database using Docker
		logger.info("Restoring to local database using Docker...");
		await execPromise(
			`docker run --rm -v pg_dump_vol:/dump --network=host postgres:17 pg_restore --clean --if-exists --no-owner --no-acl -d "${localDbUrl}" /dump/database_dump.pg`,
		);
		logger.info("Database restore completed successfully with Docker.");

		// Clean up the Docker volume
		await execPromise("docker volume rm pg_dump_vol");
		logger.info("Temporary Docker volume removed.");
	} catch (error) {
		logger.error("An error occurred during Docker dump/restore:", error);
		throw error;
	}
}

// Main function to run the appropriate method
async function main() {
	try {
		// Check for Docker
		const isDockerInstalled = await checkDockerInstallation();
		const isDockerComposeInstalled = await checkDockerComposeInstalled();

		if (!(isDockerInstalled && isDockerComposeInstalled)) {
			throw new Error("Docker or Docker Compose is not available");
		}

		// Start Docker database
		const isDbStarted = await startDockerDatabase();
		if (!isDbStarted) {
			throw new Error("Failed to start PostgreSQL in Docker");
		}

		// Check if pg tools are available in Docker
		const pgToolsAvailable = await checkPgToolsInDocker();

		if (pgToolsAvailable) {
			await dumpAndRestoreWithDocker();
		} else {
			logger.warn("Falling back to using local pg_dump and pg_restore tools");
			await dumpAndRestore();
		}

		logger.info("Database seed process completed successfully");
	} catch (error) {
		logger.error("Unhandled error:", error);
		process.exit(1);
	}
}

// Helper function to check Docker Compose installation
async function checkDockerComposeInstalled() {
	try {
		await execPromise("docker compose version");
		logger.info("Docker Compose is installed");
		return true;
	} catch {
		// Try the older "docker-compose" command
		try {
			await execPromise("docker-compose version");
			logger.info("Docker Compose (legacy) is installed");
			return true;
		} catch {
			logger.error("Docker Compose is not installed");
			return false;
		}
	}
}

// Run the main function if this file is executed directly
if (require.main === module) {
	main().catch((error) => {
		logger.error("Fatal error:", error);
		process.exit(1);
	});
}
