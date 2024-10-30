import { z } from "zod";
import {
	createRpcHandler,
	createSchema,
	createServiceSchema,
} from "@squared/rpc";
import type { Commit, Notification, TaskEvent } from "@squared/db";
import type { EventRpc } from "./types";

// Define type-safe Zod schemas
const commitSchema = createSchema<Commit>()(
	z.object({
		id: z.string(),
		branchId: z.string(),
		message: z.string(),
		timestamp: z.date(),
		url: z.string(),
		authorName: z.string().nullable(),
		repoName: z.string().nullable(),
		owner: z.string().nullable(),
		taskId: z.string().nullable(),
	}),
);

const notificationSchema = createSchema<Notification>()(
	z.object({
		id: z.string(),
		userId: z.string(),
		taskId: z.string(),
		read: z.boolean(),
		saved: z.boolean(),
		description: z.string().nullable(),
		createdAt: z.date(),
		updatedAt: z.date(),
		dismissed: z.boolean(),
		type: z.enum(["ASSIGNED", "PARTICIPATING", "MENTIONED", "CREATED"]),
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

const taskEventReturnSchema = z.union([
	z.record(
		z.object({
			oldValue: taskValueSchema,
			newValue: taskValueSchema,
		}),
	),
	commitSchema,
]);

export const eventRpcSchema = createServiceSchema<EventRpc>()({
	getTaskEvents: {
		input: z.object({ taskId: z.string() }),
		output: z.array(taskEventReturnSchema),
	},
	getNotifications: {
		input: z.object({ userId: z.string() }),
		output: z.array(notificationSchema),
	},
	createLogEvent: {
		input: z.object({
			taskId: z.string(),
			authorId: z.string(),
			changes: z.record(taskValueSchema),
		}),
		output: taskEventSchema,
	},
	createNotification: {
		input: z.object({
			userId: z.string(),
			taskId: z.string(),
			description: z.string(),
			type: z.enum(["ASSIGNED", "PARTICIPATING", "MENTIONED", "CREATED"]),
		}),
		output: notificationSchema,
	},
});

export type EventRpcSchema = typeof eventRpcSchema;

export const createEventRpcHandler = (eventService: EventRpc) =>
	createRpcHandler("event", eventRpcSchema, {
		getTaskEvents: (input) => eventService.getTaskEvents(input),
		getNotifications: (input) => eventService.getNotifications(input),
		createLogEvent: (input) => eventService.createLogEvent(input),
		createNotification: (input) => eventService.createNotification(input),
	});

export { EventService } from "./event-service";
