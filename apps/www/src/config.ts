/** biome-ignore-all lint/style/noProcessEnv: This is the entry point */
/** biome-ignore-all lint/style/useNamingConvention: These are env variables */

const NEXT_PUBLIC_SERVER = process.env.NEXT_PUBLIC_SERVER ?? "";
const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL ?? "";
const VERCEL_TARGET_ENV = process.env.VERCEL_TARGET_ENV ?? "";
const VERCEL_URL = process.env.VERCEL_URL ?? "";

export const config: Record<string, string> = {
	NEXT_PUBLIC_SERVER,
	NEXT_PUBLIC_URL,
	VERCEL_TARGET_ENV,
	VERCEL_URL,
};
