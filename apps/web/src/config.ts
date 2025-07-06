/** biome-ignore-all lint/style/noProcessEnv: This is the entry point */
/** biome-ignore-all lint/style/useNamingConvention: These are env variables */

// Check if we're in a Node.js environment (server-side with Node.js runtime)
const isNodeRuntime = typeof process !== "undefined" && process.versions?.node;

// Only use dotenv in Node.js runtime environments
if (isNodeRuntime) {
	try {
		// Dynamic import to avoid issues in Edge Runtime
		// biome-ignore lint/style/noCommonJs: This is ok
		const dotenv = require("dotenv");
		dotenv.config();
	} catch {
		// Silently fail if dotenv is not available
		// biome-ignore lint/suspicious/noConsole: This is ok
		console.warn("dotenv not available, using Next.js built-in env loading");
	}
}

// Extract environment variables (works in all runtimes)
const {
	NEXT_PUBLIC_SERVER,
	NEXT_PUBLIC_URL,
	VERCEL_TARGET_ENV = "",
	VERCEL_URL = "",
} = process.env;

// Validation with better error messages
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
