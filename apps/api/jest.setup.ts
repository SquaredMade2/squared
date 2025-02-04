import { execSync } from "node:child_process";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

export default async function () {
	try {
		// Start the test database
		execSync("pnpm run --filter=@squared/seed docker:db", {
			stdio: "inherit",
			timeout: 60 * 5 * 1000,
		});

		// Run migrations
		execSync("pnpm run --filter=@squared/db db:migrate", {
			stdio: "inherit",
			timeout: 60 * 5 * 1000,
		});

		// Seed the database
		execSync("pnpm run --filter=@squared/seed db:seed", {
			stdio: "inherit",
			timeout: 60 * 5 * 1000,
		});
	} catch (error) {
		console.error("Error setting up test environment:", error);
		throw error;
	}
}
