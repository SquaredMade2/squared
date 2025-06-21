/** biome-ignore-all lint/style/noProcessEnv: We need to use process.env */
import { exec } from "node:child_process";
import util from "node:util";
import createCustomLogger from "@squaredmade/logger";
import dotenv from "dotenv";
import { Client } from "pg";

dotenv.config();

const execPromise = util.promisify(exec);
const logger = createCustomLogger("docker-restore");

const remoteDbUrl = process.env.REMOTE_DATABASE_URL;
const localDbUrl =
	process.env.DATABASE_URL ||
	"postgres://postgres:postgres@localhost:5432/squared-test";

async function waitForPostgresReady(maxAttempts = 30) {
	logger.info("Waiting for PostgreSQL to be ready...");

	let attempts = 0;

	while (attempts < maxAttempts) {
		try {
			const client = new Client({
				connectionString: localDbUrl,
			});

			await client.connect();
			await client.query("SELECT 1");
			await client.end();

			logger.info("PostgreSQL is ready");
			return true;
		} catch {
			attempts++;
			if (attempts >= maxAttempts) {
				logger.error(
					"PostgreSQL failed to become ready within the timeout period",
				);
				throw new Error("PostgreSQL connection timeout");
			}

			logger.debug(
				`Waiting for PostgreSQL... (attempt ${attempts}/${maxAttempts})`,
			);
			// Wait for 1 second before the next attempt
			await new Promise((resolve) => setTimeout(resolve, 1000));
		}
	}
}

async function dumpAndRestoreWithDocker() {
	if (!remoteDbUrl) {
		throw new Error(
			"Remote database URL is not set in environment variables (REMOTE_DATABASE_URL)",
		);
	}

	logger.info("Starting database dump and restore process using Docker...");
	const volumeName = "pg_dump_vol";
	const dumpFileName = "database_dump.pg";

	try {
		// Create a Docker volume to store the dump file
		logger.info("Creating Docker volume for dump file...");
		await execPromise(`docker volume create ${volumeName}`);

		// Create a container for pg_dump
		logger.info("Dumping remote database using Docker...");
		await execPromise(
			`docker run --rm -v ${volumeName}:/dump postgres:17 bash -c "pg_dump --format=c --no-owner --no-acl '${remoteDbUrl}' -f /dump/${dumpFileName}"`,
		);
		logger.info("Remote database dump completed with Docker.");

		// Wait for PostgreSQL to be ready
		await waitForPostgresReady();

		// Restore to the local database using Docker
		logger.info("Restoring to local database using Docker...");
		await execPromise(
			`docker run --rm -v ${volumeName}:/dump --network=host postgres:17 bash -c "pg_restore --clean --if-exists --no-owner --no-acl -d '${localDbUrl}' /dump/${dumpFileName}"`,
		);
		logger.info("Database restore completed successfully with Docker.");

		// Clean up the Docker volume
		await execPromise(`docker volume rm ${volumeName}`);
		logger.info("Temporary Docker volume removed.");

		return true;
	} catch (error) {
		logger.error("An error occurred during Docker dump/restore:", error);

		// Try to clean up the volume if it exists
		try {
			await execPromise(`docker volume rm ${volumeName}`);
			logger.info("Cleaned up Docker volume after error.");
		} catch (cleanupError) {
			logger.warn("Could not clean up Docker volume:", cleanupError);
		}

		throw error;
	}
}

async function main() {
	try {
		logger.info("Starting Docker-based database restore process...");

		// Dump and restore using Docker
		await dumpAndRestoreWithDocker();

		logger.info("Database restore process completed successfully");
	} catch (error) {
		logger.error("Unhandled error in database restore process:", error);
		process.exit(1);
	}
}

// Run the main function if this file is executed directly
if (require.main === module) {
	main().catch((error) => {
		logger.error("Fatal error:", error);
		process.exit(1);
	});
}

export { dumpAndRestoreWithDocker, waitForPostgresReady };
