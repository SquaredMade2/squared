import { PrismaClient } from "@repo/db";

export * from "./seed-test-data";
export * from "./hash-password";
export const prisma = new PrismaClient({
	datasources: {
		db: {
			url: process.env.TEST_POSTGRES_PRISMA_URL,
		},
	},
});
