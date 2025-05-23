import { createDb } from "@squaredmade/db";
import "dotenv/config";
import { serve } from "@hono/node-server";
import createCustomLogger from "@squaredmade/logger";
import { Server } from "socket.io";
import app from "./app";

export const db = createDb({ databaseUrl: process.env.DATABASE_URL });
const logger = createCustomLogger("api");

const port = process.env.PORT || 5173;

const server = serve({
	fetch: app.fetch,
}).listen(port, () => {
	logger.info(`Server is running on http://localhost:${port}`);
});

const io = new Server(server);
// Socket.IO setup
io.on("connection", (socket) => {
	logger.info("A user connected");

	socket.on("joinRoom", (sprintId) => {
		socket.join(sprintId);
		logger.info("User joined room", sprintId);
	});

	socket.on("addItem", (data) => {
		io.to(data.sprintId).emit("itemAdded", data);
	});

	socket.on("likeItem", (data) => {
		io.to(data.sprintId).emit("itemLiked", data);
	});

	socket.on("moveItem", (data) => {
		io.to(data.sprintId).emit("itemMoved", data);
	});

	socket.on("disconnect", () => {
		logger.info("User disconnected");
	});
});
