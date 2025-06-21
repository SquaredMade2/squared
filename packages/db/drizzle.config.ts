import "dotenv/config"; // make sure to install dotenv package
import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dbCredentials: {
		// biome-ignore lint/style/noNonNullAssertion: Will Always Be Defined
		url: process.env.DATABASE_URL!,
	},
	dialect: "postgresql",
	out: "./src/migrations",
	schema: "./src/schema/index.ts",
	// Always ask for confirmation
	strict: true,
	// Print all statements
	verbose: true,
});
