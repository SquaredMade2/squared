import env from "@/env";
import { serve } from "@hono/node-server";
import createCustomLogger from "@squaredmade/logger";
import { Server } from "socket.io";
import app from "./app";

const logger = createCustomLogger("api");

const port = env.PORT;

logger.info(`Server is running on http://localhost:${port}`);
const server = serve({
	fetch: app.fetch,
	port,
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
