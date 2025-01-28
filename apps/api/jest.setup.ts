import { execSync } from "node:child_process";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

beforeAll(async () => {
	try {
		// Start the test database
		execSync("pnpm run --filter=@squared/seed docker:db", { stdio: "inherit" });

		// Reset the database
		execSync("pnpm run --filter=@squared/db db:reset", {
			stdio: "inherit",
		});

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
