import http from "node:http";
import { PrismaClient } from "@squared/db";
import createCustomLogger from "@squared/logger";
import { createErrorHandler, createRequestHandler } from "@squared/rpc";
import cors from "cors";
import express from "express";
import { Server } from "socket.io";
import { setupSwagger } from "../../swagger";
import { initializeServices } from "../services";
import { type AllRouteDeps, createApiRouter } from "./generated-routes";
import "dotenv/config";

const prisma = new PrismaClient({
	datasources: {
		db: {
			url: process.env.POSTGRES_PRISMA_URL,
		},
	},
});

const logger = createCustomLogger("api");
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 5173;

// CORS setup (unchanged)
app.use(
	cors({
		// ... (your existing CORS configuration)
	}),
);

app.use(express.json());

// Initialize services
const { services, rpcHandlers } = initializeServices(prisma);

// Set up RPC handlers
const rpcRequestHandler = createRequestHandler(Object.values(rpcHandlers));
app.use("/rpc", rpcRequestHandler);
app.use(createErrorHandler({ log: logger }));

// Initialize the router
const router = express.Router();

// Create the API router with all dependencies
const routeDeps: AllRouteDeps = {
	prisma,
	...services,
	// Add any other dependencies needed by your routes
};
createApiRouter(router, routeDeps);

// Use the router
app.use(router);

// Setup Swagger documentation
setupSwagger(router);

// Socket.IO setup (unchanged)
io.on("connection", (socket) => {
	logger.info("A user connected");

	socket.on("joinRoom", (sprintId) => {
		socket.join(sprintId);
		logger.info("User joined room: %s", sprintId);
	});

	socket.on("addItem", (data) => {
		io.to(data.sprintId).emit("itemAdded", data);
	});

	socket.on("moveItem", (data) => {
		io.to(data.sprintId).emit("itemMoved", data);
	});

	socket.on("disconnect", () => {
		logger.info("User disconnected");
	});
});

// Start the server
server.listen(port, () => {
	logger.info(`Server is running on http://localhost:${port}`);
});
