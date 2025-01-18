import { execSync } from "node:child_process";
import { createDb, sql } from "@squared/db";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });
const db = createDb({ databaseUrl: process.env.TEST_DATABASE_URL });

// const waitForDatabase = async (retries = 5, delay = 2000) => {
// 	for (let i = 0; i < retries; i++) {
// 		try {
// 			await db.execute(sql`SELECT 1`);
// 			console.log("Database is ready");
// 			return;
// 		} catch {
// 			console.log(`Attempt ${i + 1}: Database not ready, retrying...`);
// 			await new Promise((resolve) => setTimeout(resolve, delay));
// 		}
// 	}
// 	throw new Error("Database connection failed after multiple attempts");
// };

beforeAll(async () => {
	try {
		// Start the test database
		execSync("pnpm run --filter=@squared/seed docker:db", { stdio: "inherit" });

		// Reset the database
		execSync("pnpm run --filter=@squared/db db:reset", {
			stdio: "inherit",
		});

		// Wait for the database to be ready
		// await waitForDatabase();

		// Run migrations
		execSync("pnpm run --filter=@squared/db db:migrate", { stdio: "inherit" });

		// Seed the database
		execSync("pnpm run --filter=@squared/seed db:seed", { stdio: "inherit" });
	} catch (error) {
		console.error("Error setting up test environment:", error);
		throw error;
	}
}, 120000); // Increase timeout to 120 seconds

afterAll(async () => {
	try {
		// Stop the test database
		execSync("pnpm run --filter=@squared/seed docker:db:down", {
			stdio: "inherit",
		});
	} catch (error) {
		console.error("Error tearing down test environment:", error);
	}
}, 30000); // Add a timeout for afterAll
