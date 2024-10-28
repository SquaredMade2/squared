import { prisma } from "../api";
import { SprintService, createSprintRpcHandler } from "./sprints";

export const services = {
	sprint: new SprintService(prisma),
};

export const rpcHandlers = {
	sprint: createSprintRpcHandler(services.sprint),
};

export type Services = typeof services;
export type RpcHandlers = typeof rpcHandlers;
