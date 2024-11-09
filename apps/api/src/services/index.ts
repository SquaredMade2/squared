import "dotenv/config";
import { PrismaClient } from "@squared/db";
import { createAuthRpcHandler } from "./auth";
import { AuthService } from "./auth/auth-service";
import { createCommentRpcHandler } from "./comments";
import { CommentService } from "./comments/comment-service";
import { EventService, createEventRpcHandler } from "./events";
import { SprintService, createSprintRpcHandler } from "./sprints";
import { TaskService, createTaskRpcHandler } from "./tasks";

const prisma = new PrismaClient({
	datasources: {
		db: {
			url: process.env.POSTGRES_PRISMA_URL,
		},
	},
});

const secret = process.env.JWT_SECRET;

export const services = {
	sprint: new SprintService(prisma),
	event: new EventService(prisma),
	task: new TaskService(prisma),
	comment: new CommentService(prisma),
	auth: new AuthService(prisma, secret),
};

export const rpcHandlers = {
	sprint: createSprintRpcHandler(services.sprint),
	event: createEventRpcHandler(services.event),
	task: createTaskRpcHandler(services.task),
	comment: createCommentRpcHandler(services.comment),
	auth: createAuthRpcHandler(services.auth),
};

export type Services = typeof services;
export type RpcHandlers = typeof rpcHandlers;
