import { rpcHandlers } from "@/services";
import { PrismaClient } from "@squared/db";
import createCustomLogger from "@squared/logger";
import { createErrorHandler, createRequestHandler } from "@squared/rpc";
import cors from "cors";
import express from "express";
import "dotenv/config";
import { createApiRouter } from "./generated-routes";

export const prisma = new PrismaClient({
	datasources: {
		db: {
			url: process.env.POSTGRES_PRISMA_URL,
		},
	},
});

const logger = createCustomLogger("api");

export function createApp() {
	const app = express();

	const productionDomain = "https://app.squaredmade.com";
	const productionServerDomain = "https://api.squaredmade.com";
	const developmentDomain = "https://app-develop.squaredmade.com";
	const localDevDomain = "http://localhost:3000";
	const localServerDomain = `http://localhost:${process.env.PORT || 5173}`;

	// Health check route for root path
	app.get("/", (_, res) => {
		res.status(200).send("ok");
	});

	app.use(
		cors({
			origin: (origin, callback) => {
				if (
					!origin ||
					/^https:\/\/web-(\w+)-squaredmade\.vercel\.app$/.test(origin) ||
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
			methods: ["GET", "POST", "PUT", "DELETE"],
			credentials: true,
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
	createApiRouter(router, { prisma });
	app.use(router);

	return app;
}
