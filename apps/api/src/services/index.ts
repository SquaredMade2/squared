import "dotenv/config";
import { PrismaClient } from "@squared/db";
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
export const services = {
	sprint: new SprintService(prisma),
	event: new EventService(prisma),
	task: new TaskService(prisma),
};

export const rpcHandlers = {
	sprint: createSprintRpcHandler(services.sprint),
	event: createEventRpcHandler(services.event),
	task: createTaskRpcHandler(services.task),
};

export type Services = typeof services;
export type RpcHandlers = typeof rpcHandlers;
