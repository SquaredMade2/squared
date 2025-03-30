import { exec } from "node:child_process";
import fs from "node:fs";
import util from "node:util";
import createCustomLogger from "@squaredmade/logger";
import dotenv from "dotenv";

dotenv.config();

const execPromise = util.promisify(exec);
const logger = createCustomLogger("seed");

const remoteDbUrl = process.env.REMOTE_DATABASE_URL;
const localDbUrl = process.env.DATABASE_URL;

if (!remoteDbUrl || !localDbUrl) {
	throw new Error("Database URLs are not set in environment variables");
}

async function dumpAndRestore() {
	logger.info("Starting database dump and restore process...");

	const dumpFilePath = "database_dump.pg";

	try {
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
	}
}

dumpAndRestore().catch((error) => {
	logger.error("Unhandled error:", error);
	process.exit(1);
});
