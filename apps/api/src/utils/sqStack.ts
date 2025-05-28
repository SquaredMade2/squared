import { createDb } from "@squaredmade/db";
import createCustomLogger from "@squaredmade/logger";
import { sqStack } from "@squaredmade/rpc";
import { env } from "hono/adapter";
import z from "zod/v4";

const envSchema = z.object({
	Bindings: z.object({
		SQUARED_API_KEY: z.string(),
		NEXT_PUBLIC_CONFIRM_URL: z.url(),
		PORT: z.coerce.number().default(5173),
		DATABASE_URL: z.string(),
		LOCAL_DB: z.coerce.boolean().default(false),
		CLERK_SECRET: z.string(),
		CLERK_SECRET_KEY: z.string(),
		DISCORD_BOT_TOKEN: z.string(),
	}),
});

type Env = z.infer<typeof envSchema>;

export const j = sqStack.init<Env>();

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
