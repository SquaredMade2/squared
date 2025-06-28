import { createDb } from "@squaredmade/db";
import createCustomLogger from "@squaredmade/logger";
import { createErrorHandler, createRequestHandler } from "@squaredmade/rpc";
import cors from "cors";
import express from "express";
import config from "@/config";
import { rpcHandlers } from "@/services";

export const db = createDb({ databaseUrl: config.databaseUrl });

const logger = createCustomLogger("api");
const vercelRegex = /^https:\/\/web-(\w+)-squaredmade\.vercel\.app$/;

function createApp() {
	const app = express();

	const productionDomain = "https://app.squaredmade.com";
	const productionServerDomain = "https://api.squaredmade.com";
	const developmentDomain = "https://app-develop.squaredmade.com";
	const localDevDomain = "http://localhost:3000";
	const localServerDomain = `http://localhost:${config.port || 5173}`;

	// Health check route for root path
	app.get("/", (_, res) => {
		res.status(200).send("ok");
	});

	app.use(
		cors({
			credentials: true,
			methods: ["GET", "POST", "PUT", "DELETE"],
			origin: (origin, callback) => {
				if (
					!origin ||
					vercelRegex.test(origin) ||
					origin === productionDomain ||
					origin === productionServerDomain ||
					origin === developmentDomain ||
					origin === localDevDomain ||
					origin === localServerDomain
				) {
					callback(null, true);
				} else {
					callback(new Error("Not allowed by CORS"));
				}
			},
		}),
	);

	app.use(express.json());

	if (rpcHandlers && Object.keys(rpcHandlers).length > 0) {
		const rpcRequestHandler = createRequestHandler(Object.values(rpcHandlers));
		app.use("/rpc", rpcRequestHandler);
	} else {
		logger.warn(
			"rpcHandlers is undefined or empty. RPC endpoints will not be available.",
		);
	}

	const rpcRequestHandler = createRequestHandler(Object.values(rpcHandlers));
	app.use("/rpc", rpcRequestHandler);

	app.use(createErrorHandler({ log: logger }));

	const router = express.Router();
	app.use(router);

	return app;
}

export const app = createApp();
