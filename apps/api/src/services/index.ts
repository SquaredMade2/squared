import "dotenv/config";
import { PrismaClient } from "@squared/db";
import { SprintService, createSprintRpcHandler } from "./sprints";
import { createEventRpcHandler, EventService } from "./events";

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
};

export const rpcHandlers = {
	sprint: createSprintRpcHandler(services.sprint),
	event: createEventRpcHandler(services.event),
};

export type Services = typeof services;
export type RpcHandlers = typeof rpcHandlers;
