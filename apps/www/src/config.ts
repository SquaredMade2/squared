/** biome-ignore-all lint/style/noProcessEnv: This is the entry point */
/** biome-ignore-all lint/style/useNamingConvention: These are env variables */
const { NEXT_PUBLIC_APP_URL } = process.env;
process.env;
if (!NEXT_PUBLIC_APP_URL) {
	throw new Error("Missing NEXT_PUBLIC_SERVER environment variable");
}

export const config: Record<string, string> = {
	NEXT_PUBLIC_APP_URL,
};
