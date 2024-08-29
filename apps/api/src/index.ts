require("./instrument"); // Ensure Sentry is initialized before other imports

import "dotenv/config";
import "tslib";
import express from "express";
import type { Request, Response, NextFunction, Express } from "express";
import * as Sentry from "@sentry/node";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import AppError from "./utils/AppError";
import authRoutes from "./routes/authRoutes";
import eventRoutes from "./routes/eventsRoutes";
import taskRoutes from "./routes/taskRoutes";
import teamRoutes from "./routes/teamRoutes";
import workspaceRoutes from "./routes/workspaceRoutes";
import filterRoutes from "./routes/pageFilterRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import githubRoutes from "./routes/githubRoutes"; // for GitHub integration
import type { Socket } from "socket.io";
// import webhookRoutes from "./routes/ghWebhookRoutes";
// import commitsRoutes from "./routes/commitsRoutes";

const {
	getUsersNotification,
	userMentionedOnTask,
	removedNotification,
	updateNotificationToRead,
} = require("./io/notification");
const { Server } = require("socket.io");
const { createServer } = require("node:http");

const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 5173;

const app: Express = express();
const server = createServer(app);

// Setup Sentry error handler
require("./instrument"); // Ensure this is called before importing other modules
Sentry.setupExpressErrorHandler(app);

const swaggerUI = require("swagger-ui-express");
const swaggerjsdoc = require("swagger-jsdoc");

const swaggerDefinition = {
	openapi: "3.0.0",
	info: {
		version: "1.0.0",
		title: "Squared API",
		description: "API documentation for Squared",
	},
	servers: [
		{
			url: `http://localhost:${PORT}`,
			description: "Development server",
		},
	],
};

const options = {
	swaggerDefinition,
	apis: ["./src/**/*.ts"],
};
const swaggerDocument = swaggerjsdoc(options);

// Database connection
let dbname = "test";
if (process.env.NODE_ENV === "test") {
	dbname = "testing";
}
mongoose.set("strictQuery", false);
mongoose
	.connect(MONGO_URL, { dbName: dbname })
	.then(() => {
		console.log("Database Connected");
	})
	.catch((err) => {
		console.log("Database Connection Error", err);
	});

const vercelBranchPattern =
	/^https:\/\/squared-[a-z0-9-]+-squared-52c50d26\.vercel\.app$/;
const productionDomain = "https://squared-web.vercel.app";
const localDevDomain = "http://localhost:3000";

app.use(
	cors({
		origin: (origin, callback) => {
			// Allow requests from Vercel branch deployments, production domain, and local development
			if (
				!origin ||
				vercelBranchPattern.test(origin) ||
				origin === productionDomain ||
				origin === localDevDomain
			) {
				callback(null, true);
			} else {
				callback(new Error("Not allowed by CORS"));
			}
		},
		methods: ["GET", "POST", "PUT", "DELETE"],
		credentials: true, // Allows credentials to be sent in requests
	}),
);

const io = new Server(server);

const userSocketId: { [key: string]: string } = {};

io.on("connection", (socket: Socket) => {
	socket.on("getUser", (userId: string) => {
		userSocketId[userId] = socket.id;
	});

	socket.on("socketId", (userId: string) => {
		getUsersNotification(userSocketId, userId, io);
	});
	socket.on(
		"user_mentioned",
		(mentionedUser: string[], taskId: string, mentionedBy: string) => {
			userMentionedOnTask(userSocketId, io, mentionedUser, taskId, mentionedBy);
		},
	);
	socket.on("remove_notification", (taskId: string, userId: string) => {
		removedNotification(userSocketId, io, taskId, userId);
	});
	socket.on(
		"sending_notificationId",
		(notificationIds: string | string[], userId: string) => {
			updateNotificationToRead(userSocketId, notificationIds, userId, io);
		},
	);
});

// Middleware

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/auth", authRoutes);
app.use("/event", eventRoutes);
app.use("/task", taskRoutes);
app.use("/team", teamRoutes);
app.use("/workspace", workspaceRoutes);
app.use("/filter", filterRoutes);
app.use("/uploads", uploadRoutes);
app.use("/github", githubRoutes);
// app.use("/webhooks", webhookRoutes);
// app.use("/commit", commitsRoutes);
app.get("/ping", (_req, res) => {
	res.send("pong");
});

// Default 404 handler
app.all("*", (req: Request, res: Response, next: NextFunction): void => {
	next(new AppError("$$$ Page Not Found $$$", 404));
});

// Default error handler
app.use(
	(
		err: { status: number; message: string },
		req: Request,
		res: Response,
		next: NextFunction,
	): void => {
		const { status = 500 } = err;
		if (!err.message) err.message = "$$$ Internal Server Error $$$";
		res.status(status).send(err.message);
	},
);

server.listen(PORT, (): void => {
	console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
export default app;
