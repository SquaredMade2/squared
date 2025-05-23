import { rpcHandlers } from "@/services";
import { OpenAPIHono } from "@hono/zod-openapi";
import createCustomLogger from "@squaredmade/logger";
import { createErrorHandler, createRequestHandler } from "@squaredmade/rpc";
import { cors } from "hono/cors";

const app = new OpenAPIHono();
const logger = createCustomLogger("api");
const port = process.env.PORT || 5173;

app.get("/", (c) => c.text("ok", 200));
const productionDomain = "https://app.squaredmade.com";
const productionServerDomain = "https://api.squaredmade.com";
const developmentDomain = "https://app-develop.squaredmade.com";
const localDevDomain = "http://localhost:3000";
const localServerDomain = `http://localhost:${port}`;

// Health check route for root path
app.get("/", (c) => c.text("ok", 200));
app.use(
	"/*",
	cors({
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
		allowMethods: ["GET", "POST", "PUT", "DELETE"],
		credentials: true,
	}),
);

const rpcRequestHandler = createRequestHandler(Object.values(rpcHandlers));
app.use("/rpc/*", rpcRequestHandler);

// Use the RPC error handler
app.use(createErrorHandler({ log: logger }));

export default app;
