import "dotenv/config";
import { PrismaClient } from "@squared/db";
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

const sprint = new SprintService(prisma);
const event = new EventService(prisma);
const task = new TaskService(prisma);
const comment = new CommentService(prisma);

export const services = {
	sprint,
	event,
	task,
	comment,
};

export const rpcHandlers = {
	sprint: createSprintRpcHandler(services.sprint),
	event: createEventRpcHandler(services.event),
	task: createTaskRpcHandler(services.task),
	comment: createCommentRpcHandler(services.comment),
};

export type Services = typeof services;
export type RpcHandlers = typeof rpcHandlers;
