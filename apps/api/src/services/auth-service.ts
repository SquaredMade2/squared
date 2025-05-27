import { baseProcedure, j } from "@/middleware";
import { eq, usersTable } from "@squaredmade/db";
import z from "zod/v4";

export const authService = j.router({
	register: baseProcedure
		.input(
			z.object({
				email: z.string(),
				name: z.string(),
				username: z.string(),
				externalId: z.string(),
			}),
		)
		.mutation(async ({ input, ctx, c }) => {
			const { email, name, username, externalId } = input;
			const { db, logger } = ctx;
			const [existingUser] = await db
				.select()
				.from(usersTable)
				.where(eq(usersTable.email, email));
			if (existingUser) {
				logger.info("User %s already exists", email);
				return c.superjson(existingUser);
			}

			const [user] = await db
				.insert(usersTable)
				.values({
					name,
					username,
					email,
					externalId,
				})
				.returning();

			return c.superjson(user, 201);
		}),
});
