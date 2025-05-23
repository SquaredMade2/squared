import * as z from "zod/v4";
import "dotenv/config";

const envSchema = z.object({
	SQUARED_API_KEY: z.string(),
	NEXT_PUBLIC_CONFIRM_URL: z.url(),
	PORT: z.coerce.number().default(5173),
	DATABASE_URL: z.string(),
	LOCAL_DB: z.coerce.boolean().default(false),
	CLERK_SECRET: z.string(),
	CLERK_SECRET_KEY: z.string(),
	DISCORD_BOT_TOKEN: z.string(),
});

export type Env = z.infer<typeof envSchema>;

let env: Env;

try {
	env = envSchema.parse(process.env);
} catch (e) {
	const error = e as z.ZodError;
	console.error(z.treeifyError(error));
	process.exit(1);
}

export default env;
