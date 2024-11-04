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
