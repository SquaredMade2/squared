import { execSync } from "node:child_process";
import { PrismaClient } from "@squared/db";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

const prisma = new PrismaClient();

beforeAll(async () => {
	// Start the test database
	execSync("pnpm run --filter=@squared/seed docker:db", { stdio: "inherit" });

	// Wait for the database to be ready
	await new Promise((resolve) => setTimeout(resolve, 5000));

	// Run migrations
	execSync("pnpm run --filter=@squared/db db:push", { stdio: "inherit" });

	// Seed the database
	execSync("pnpm run --filter=@squared/seed db:seed", { stdio: "inherit" });
});

afterAll(async () => {
	await prisma.$disconnect();

	// Stop the test database
	execSync("pnpm run --filter=@squared/seed docker:db:down", {
		stdio: "inherit",
	});
});

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
});
