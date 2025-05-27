import { j } from "@/api/app";
import { createDb } from "@squaredmade/db";
import createCustomLogger from "@squaredmade/logger";
import { env } from "hono/adapter";

/**
 * Type-safely injects database into all procedures
 *
 * @see https://jstack.app/docs/backend/middleware
 */
const databaseMiddleware = j.middleware(async ({ c, next }) => {
	const { DATABASE_URL } = env(c);

	const db = createDb({ databaseUrl: DATABASE_URL });
	const logger = createCustomLogger("api-base");

	return await next({ db, logger });
});

/**
 * Public (unauthenticated) procedures
 *
 * This is the base piece you use to build new queries and mutations on your API.
 */
export const baseProcedure = j.procedure.use(databaseMiddleware);
