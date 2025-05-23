import { cors as honoCors } from "hono/cors";

const productionDomain = "https://app.squaredmade.com";
const productionServerDomain = "https://api.squaredmade.com";
const developmentDomain = "https://app-develop.squaredmade.com";
const localDevDomain = "http://localhost:3000";
const localServerDomain = `http://localhost:${process.env.PORT || 5173}`;

export const cors = honoCors({
	allowHeaders: ["x-is-superjson", "Content-Type"],
	exposeHeaders: ["x-is-superjson"],
	origin: (origin) => {
		// Allow requests from Vercel branch deployments, production domain, and local development
		if (
			!origin ||
			/^https:\/\/web-(\w+)-squaredmade\.vercel\.app$/.test(origin) ||
			origin === productionDomain ||
			origin === productionServerDomain ||
			origin === developmentDomain ||
			origin === localDevDomain ||
			origin === localServerDomain
		) {
			return origin;
		}
		return null;
	},
	credentials: true,
});
