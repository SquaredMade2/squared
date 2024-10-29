import "dotenv/config";
import { PrismaClient } from "@squared/db";
import { SprintService, createSprintRpcHandler } from "./sprints";

const prisma = new PrismaClient({
	datasources: {
		db: {
			url: process.env.TEST_POSTGRES_PRISMA_URL,
		},
	},
});
export const services = {
	sprint: new SprintService(prisma),
};

export const rpcHandlers = {
	sprint: createSprintRpcHandler(services.sprint),
};

export type Services = typeof services;
export type RpcHandlers = typeof rpcHandlers;
