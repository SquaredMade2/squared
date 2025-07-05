/** biome-ignore-all lint/style/noProcessEnv: This is the entry point */
/** biome-ignore-all lint/style/useNamingConvention: These are env variables */
import "dotenv/config";

const {
	NEXT_PUBLIC_SERVER,
	NEXT_PUBLIC_URL,
	VERCEL_TARGET_ENV = "",
	VERCEL_URL = "",
} = process.env;
if (!NEXT_PUBLIC_SERVER) {
	throw new Error("Missing NEXT_PUBLIC_SERVER environment variable");
}
if (!NEXT_PUBLIC_URL) {
	throw new Error("Missing NEXT_PUBLIC_URL environment variable");
}

export const config: Record<string, string> = {
	NEXT_PUBLIC_SERVER,
	NEXT_PUBLIC_URL,
	VERCEL_TARGET_ENV,
	VERCEL_URL,
};
