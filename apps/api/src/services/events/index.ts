import type { TaskEvent } from "@squared/db";
import {
	createRpcHandler,
	createSchema,
	createServiceSchema,
} from "@squared/rpc";
import { z } from "zod";
import {
	commitSchema,
	notificationSchema,
	taskSchema,
	workspaceSchema,
} from "../schema";
import type { EventRpc, FullNotification } from "./types";

// Define type-safe Zod schemas

const fullNotificationSchema = createSchema<FullNotification>()(
	z.object({
		...notificationSchema.shape,
		Workspace: workspaceSchema.nullable(),
		Task: taskSchema.nullable(),
	}),
);

const taskEventSchema = createSchema<TaskEvent>()(
	z.object({
		id: z.string(),
		authorId: z.string(),
		createdAt: z.date(),
		taskId: z.string(),
		message: z.string(),
	}),
);

const taskValueSchema = z.union([
	z.string(),
	z.number(),
	z.boolean(),
	z.date(),
	z.array(z.string()),
	z.null(),
]);

const taskEventReturnSchema = z.array(z.union([taskEventSchema, commitSchema]));

export const eventRpcSchema = createServiceSchema<EventRpc>()({
	getTaskEvents: {
		input: z.object({ taskId: z.string() }),
		output: taskEventReturnSchema,
	},
	getNotifications: {
		input: z.object({ userId: z.string() }),
		output: z.array(fullNotificationSchema),
	},
	createLogEvent: {
		input: z.object({
			taskId: z.string(),
			authorId: z.string(),
			changes: z.record(taskValueSchema),
			previousTask: taskSchema,
		}),
		output: taskEventSchema.nullable(),
	},
	createNotification: {
		input: z.object({
			userId: z.string(),
			workspaceId: z.string(),
			taskId: z.string(),
			description: z.string(),
			type: z.enum(["ASSIGNED", "PARTICIPATING", "MENTIONED", "CREATED"]),
		}),
		output: notificationSchema,
	},
	toggleNotification: {
		input: z.object({
			notificationIds: z.array(z.string()),
			read: z.boolean().optional(),
			dismissed: z.boolean().optional(),
		}),
		output: z.array(notificationSchema),
	},
	deleteNotification: {
		input: z.object({ notificationIds: z.array(z.string()) }),
		output: z.void(),
	},
});

export type EventRpcSchema = typeof eventRpcSchema;

export const createEventRpcHandler = (eventService: EventRpc) =>
	createRpcHandler("event", eventRpcSchema, {
		getTaskEvents: (input) => eventService.getTaskEvents(input),
		getNotifications: (input) => eventService.getNotifications(input),
		createLogEvent: (input) => eventService.createLogEvent(input),
		createNotification: (input) => eventService.createNotification(input),
		toggleNotification: (input) => eventService.toggleNotification(input),
		deleteNotification: (input) => eventService.deleteNotification(input),
	});

export { EventService } from "./event-service";
