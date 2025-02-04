import { execSync } from "node:child_process";

export default async function () {
	try {
		// Stop the test database
		execSync("pnpm run --filter=@squared/seed docker:db:down", {
			stdio: "inherit",
			timeout: 60 * 5 * 1000,
		});
	} catch (error) {
		console.error("Error tearing down test environment:", error);
	}
}
