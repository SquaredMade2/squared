import { PrismaClient } from "@squared/db";
import createCustomLogger from "@squared/logger";
import bcrypt from "bcryptjs";
import "dotenv/config";

export const logger = createCustomLogger("seed");

export const prisma = new PrismaClient({
	datasources: {
		db: {
			url: process.env.TEST_POSTGRES_PRISMA_URL,
		},
	},
});

export const hashPassword = (password: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		bcrypt.genSalt(10, (error, salt) => {
			if (error) {
				reject(error);
			}
			bcrypt.hash(password, salt, (error, hash) => {
				if (error) {
					reject(error);
				}
				resolve(hash);
			});
		});
	});
};

/**
 * Destroy all data. Useful for wiping the slate clean between tests.
 *
 * source: https://www.prisma.io/docs/orm/prisma-client/queries/crud#deleting-all-data-with-raw-sql--truncate
 */
export async function resetDB() {
	const tablenames = await prisma.$queryRaw<
		Array<{ tablename: string }>
	>`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

	const tables = tablenames
		.map(({ tablename }) => tablename)
		.filter((name) => name !== "_prisma_migrations")
		.map((name) => `"public"."${name}"`)
		.join(", ");

	try {
		await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
		logger.info("Successfully reset the database.");
	} catch (e) {
		logger.error("There was an error resetting the database: %O", e);
	}
}

