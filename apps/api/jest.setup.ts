import { execSync } from "node:child_process";
import { PrismaClient } from "@squared/db";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

const prisma = new PrismaClient();

const waitForDatabase = async (retries = 5, delay = 2000) => {
	for (let i = 0; i < retries; i++) {
		try {
			await prisma.$queryRaw`SELECT 1`;
			console.log("Database is ready");
			return;
		} catch {
			console.log(`Attempt ${i + 1}: Database not ready, retrying...`);
			await new Promise((resolve) => setTimeout(resolve, delay));
		}
	}
	throw new Error("Database connection failed after multiple attempts");
};

beforeAll(async () => {
	try {
		// Start the test database
		execSync("pnpm run --filter=@squared/seed docker:db", { stdio: "inherit" });

		// Wait for the database to be ready
		await waitForDatabase();

		// Run migrations
		execSync("pnpm run --filter=@squared/db db:push", { stdio: "inherit" });
	} catch (error) {
		console.error("Error setting up test environment:", error);
		throw error;
	}
}, 120000); // Increase timeout to 120 seconds

afterAll(async () => {
	try {
		await prisma.$disconnect();

		// Reset the database
		execSync("pnpm run --filter=@squared/db db:reset", {
			stdio: "inherit",
		});

		// Stop the test database
		execSync("pnpm run --filter=@squared/seed docker:db:down", {
			stdio: "inherit",
		});
	} catch (error) {
		console.error("Error tearing down test environment:", error);
	}
}, 30000); // Add a timeout for afterAll

beforeEach(async () => {
	// Clean up the database before each test
	const tables =
		await prisma.$queryRaw`SELECT tablename FROM pg_tables WHERE schemaname='public'`;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	for (const { tablename } of tables as any[]) {
		if (tablename !== "_prisma_migrations") {
			await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${tablename}" CASCADE;`);
		}
	}

	// Seed the database
	execSync("pnpm run --filter=@squared/seed db:seed", { stdio: "inherit" });
});
