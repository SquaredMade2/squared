import type { PrismaClient } from "@squared/db";
import { EventService, createEventRpcHandler } from "./events";
import { SprintService, createSprintRpcHandler } from "./sprints";
import { TaskService, createTaskRpcHandler } from "./tasks";

export function initializeServices(prisma: PrismaClient) {
	const eventService = new EventService(prisma);
	const sprintService = new SprintService(prisma);
	const taskService = new TaskService(prisma, eventService);

	const services = {
		event: eventService,
		sprint: sprintService,
		task: taskService,
	};

	const rpcHandlers = {
		event: createEventRpcHandler(services.event),
		sprint: createSprintRpcHandler(services.sprint),
		task: createTaskRpcHandler(services.task),
	};

	return { services, rpcHandlers };
}

export type Services = ReturnType<typeof initializeServices>["services"];
export type RpcHandlers = ReturnType<typeof initializeServices>["rpcHandlers"];
