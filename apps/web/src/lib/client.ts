import { createClient } from "jstack";
import { config } from "@/config";
import type { AppRouter } from "@/server";

const getBaseUrl = () => {
	// browser should use relative path
	if (typeof window !== "undefined") {
		return "";
	}

	if (config.NODE_ENV === "development") {
		return "http://localhost:8080";
	}

	// if deployed to vercel, use vercel url
	if (config.VERCEL_URL) {
		return `https://${config.VERCEL_URL}`;
	}

	// assume deployment to cloudflare workers otherwise, you'll get this URL after running
	// `npm run deploy`, which deploys your server to cloudflare
	return "https://<YOUR_DEPLOYED_WORKER_URL>/";
};

/**
 * Your type-safe API client
 * @see https://jstack.app/docs/backend/api-client
 */
export const client = createClient<AppRouter>({
	baseUrl: `${getBaseUrl()}/api`,
});
