import { exec } from "node:child_process";
import util from "node:util";
import createCustomLogger from "@squaredmade/logger";

const execPromise = util.promisify(exec);
const logger = createCustomLogger("docker-check");

async function checkDockerInstallation() {
	try {
		const { stdout } = await execPromise("docker --version");
		logger.info("Docker is installed:", stdout.trim());
		return true;
	} catch {
		logger.error("Docker is not installed. Please install Docker to continue.");
		return false;
	}
}

async function checkDockerComposeInstallation() {
	try {
		const { stdout } = await execPromise("docker compose version");
		logger.info("Docker Compose is installed:", stdout.trim());
		return true;
	} catch {
		// Try the older "docker-compose" command
		try {
			const { stdout } = await execPromise("docker-compose version");
			logger.info("Docker Compose (legacy) is installed:", stdout.trim());
			return true;
		} catch {
			logger.error(
				"Docker Compose is not installed. Please install Docker Compose to continue.",
			);
			return false;
		}
	}
}

async function main() {
	try {
		logger.info("Checking Docker installation...");

		const dockerInstalled = await checkDockerInstallation();
		const dockerComposeInstalled = await checkDockerComposeInstallation();

		if (dockerInstalled && dockerComposeInstalled) {
			logger.info("All Docker components are installed correctly.");
			process.exit(0);
		} else {
			logger.error(
				"Some Docker components are missing. Please install them to continue.",
			);
			process.exit(1);
		}
	} catch (error) {
		logger.error(
			"An error occurred while checking Docker installation:",
			error,
		);
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

export { checkDockerInstallation, checkDockerComposeInstallation };
