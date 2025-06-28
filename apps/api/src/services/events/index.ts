import type { TaskEvent } from "@squaredmade/db";
import {
	createRpcHandler,
	createSchema,
	createServiceSchema,
} from "@squaredmade/rpc";
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
		task: taskSchema,
		workspace: workspaceSchema,
	}),
);

const taskEventSchema = createSchema<TaskEvent>()(
	z.object({
		authorId: z.string(),
		createdAt: z.date(),
		id: z.string(),
		message: z.string(),
		taskId: z.string(),
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
	createLogEvent: {
		input: z.object({
			authorId: z.string(),
			changes: z.record(taskValueSchema),
			previousTask: taskSchema,
			taskId: z.string(),
		}),
		output: taskEventSchema.nullable(),
	},
	createNotification: {
		input: z.object({
			description: z.string(),
			taskId: z.string(),
			type: z.enum(["ASSIGNED", "PARTICIPATING", "MENTIONED", "CREATED"]),
			userId: z.string(),
			workspaceId: z.string(),
		}),
		output: notificationSchema,
	},
	deleteNotification: {
		input: z.object({ notificationIds: z.array(z.string()) }),
		output: z.void(),
	},
	getNotifications: {
		input: z.object({ userId: z.string() }),
		output: z.array(fullNotificationSchema),
	},
	getTaskEvents: {
		input: z.object({ taskId: z.string() }),
		output: taskEventReturnSchema,
	},
	toggleNotification: {
		input: z.object({
			dismissed: z.boolean().optional(),
			notificationIds: z.array(z.string()),
			read: z.boolean().optional(),
		}),
		output: z.array(fullNotificationSchema),
	},
});

export type EventRpcSchema = typeof eventRpcSchema;

export const createEventRpcHandler = (eventService: EventRpc) =>
	createRpcHandler("event", eventRpcSchema, {
		createLogEvent: (input) => eventService.createLogEvent(input),
		createNotification: (input) => eventService.createNotification(input),
		deleteNotification: (input) => eventService.deleteNotification(input),
		getNotifications: (input) => eventService.getNotifications(input),
		getTaskEvents: (input) => eventService.getTaskEvents(input),
		toggleNotification: (input) => eventService.toggleNotification(input),
	});

export { EventService } from "./event-service";
