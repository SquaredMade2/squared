import { createDb } from "@squaredmade/db";
import createCustomLogger from "@squaredmade/logger";
import { jstack } from "@squaredmade/rpc";
import { env } from "hono/adapter";

interface Env {
	Bindings: {
		SQUARED_API_KEY: string;
		NEXT_PUBLIC_CONFIRM_URL: string;
		PORT: number;
		DATABASE_URL: string;
		LOCAL_DB: boolean;
		CLERK_SECRET: string;
		CLERK_SECRET_KEY: string;
		DISCORD_BOT_TOKEN: string;
	};
}

export const j = jstack.init<Env>();

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
