import "dotenv/config";
import "tslib";
import * as Sentry from "@sentry/node";
import express from "express";
import type { Request, Response, NextFunction, Express } from "express";
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
import githubRoutes from "./routes/githubRoutes"; // for github integration
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

Sentry.init({
	dsn: "https://ca633bd0aa68f0c8d9a9e5fadbd04945@o4506289111302144.ingest.sentry.io/4506289115168768",
	integrations: [
		// enable HTTP calls tracing
		new Sentry.Integrations.Http({ tracing: true }),
		// enable Express.js middleware tracing
		new Sentry.Integrations.Express({ app }),
	],
	// Performance Monitoring
	tracesSampleRate: 1.0,
	// Set sampling rate for profiling - this is relative to tracesSampleRate
	profilesSampleRate: 1.0,
});

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

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

// database connection
let dbname = "test";
if (process.env.NODE_ENV === "test") {
	dbname = "testing";
}
mongoose.set("strictQuery", false);
mongoose
	.connect(MONGO_URL, { dbName: dbname })
	.then((): void => {
		console.log("Database Connected");
	})
	.catch((err: string): void => {
		console.log("Database Connection Error", err);
	});

type StaticOrigin =
	| boolean
	| string
	| RegExp
	| Array<boolean | string | RegExp>;

app.use(
	cors({
		origin: "https://squared-web.vercel.app",
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"],
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

app.use(Sentry.Handlers.errorHandler());

// middlewere

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// routes
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

// if url path does not match with route path
app.all("*", (req: Request, res: Response, next: NextFunction): void => {
	next(new AppError("$$$ Page Not Found $$$", 404));
});

// default error
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

server.listen(PORT, (): void => {});

module.exports = app;
export default app;
