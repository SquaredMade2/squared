import { z } from "zod";
import { createRpcHandler, createSchema } from "@squared/http-rpc";
import { SprintService } from "./sprint-service";
import type {
	NextSprintPayload,
	AddRetrospectivePayload,
	UpdateRetrospectiveItemPayload,
	RetrospectiveData,
	RetroItemReturn,
} from "./types";
import type { Sprint, Task } from "@squared/db";

// Define type-safe Zod schemas
const sprintSchema = createSchema<Sprint>()(
	z.object({
		id: z.string(),
		name: z.string(),
		startDate: z.date(),
		endDate: z.date(),
		status: z.enum(["PLANNED", "ACTIVE", "COMPLETED"]),
		teamId: z.string(),
		createdAt: z.date(),
		updatedAt: z.date(),
	}),
);

const taskSchema = createSchema<Task>()(
	z.object({
		id: z.string(),
		title: z.string(),
		description: z.string().nullable(),
		status: z.enum([
			"backlog",
			"todo",
			"inProgress",
			"inReview",
			"done",
			"canceled",
			"archived",
		]),
		sprintId: z.string().nullable(),
		teamId: z.string(),
		updatedAt: z.date(),
		authorId: z.string(),
		identifier: z.string(),
		dueDate: z.date().nullable(),
		effortEstimate: z.number().nullable(),
		priority: z.enum(["noPriority", "urgent", "high", "medium", "low"]),
		dateCreated: z.date(),
		assigneeId: z.string().nullable(),
		assigneeName: z.string().nullable(),
		labels: z.array(z.string()),
		workspaceId: z.string(),
		parentId: z.string().nullable(),
		deleted: z.boolean(),
	}),
);

const retrospectiveItemReturnSchema = createSchema<RetroItemReturn>()(
	z.object({
		id: z.string(),
		content: z.string(),
		type: z.enum(["toImprove", "wentWell", "actionItems"]),
	}),
);

export const sprintRpcSchema = {
	getSprints: {
		input: z.object({ teamId: z.string() }),
		output: z.array(sprintSchema),
	},
	initializeSprints: {
		input: z.object({ teamId: z.string() }),
		output: z.number(),
	},
	startNextSprint: {
		input: createSchema<NextSprintPayload>()(
			z.object({
				teamId: z.string(),
				movedTasks: z.array(z.string()),
				sprintData: z.object({ name: z.string() }).optional(),
			}),
		),
		output: z.union([
			z.object({
				status: z.number(),
				message: z.string(),
				variant: z.literal("destructive"),
			}),
			z.object({
				data: sprintSchema,
				message: z.string(),
				variant: z.literal("default"),
			}),
		]),
	},
	getSprintTasks: {
		input: z.object({ sprintId: z.string() }),
		output: z.array(taskSchema),
	},
	endSprint: {
		input: z.object({ sprintId: z.string() }),
		output: sprintSchema,
	},
	addRetrospectiveItem: {
		input: createSchema<AddRetrospectivePayload>()(
			z.object({
				sprintId: z.string(),
				type: z.enum(["wentWell", "toImprove", "actionItems"]),
				content: z.string(),
			}),
		),
		output: retrospectiveItemReturnSchema,
	},
	updateRetrospectiveItem: {
		input: createSchema<UpdateRetrospectiveItemPayload>()(
			z.object({
				retrospectiveItemId: z.string(),
				type: z.enum(["wentWell", "toImprove", "actionItems"]).optional(),
				content: z.string().optional(),
				sprintId: z.string(),
			}),
		),
		output: retrospectiveItemReturnSchema,
	},
	getRetrospectiveItems: {
		input: z.object({ sprintId: z.string() }),
		output: createSchema<RetrospectiveData>()(
			z.object({
				wentWell: z.array(retrospectiveItemReturnSchema),
				toImprove: z.array(retrospectiveItemReturnSchema),
				actionItems: z.array(retrospectiveItemReturnSchema),
			}),
		),
	},
};

export type SprintRpcSchema = typeof sprintRpcSchema;

export const createSprintRpcHandler = (sprintService: SprintService) =>
	createRpcHandler("sprint", sprintRpcSchema, {
		getSprints: (input) => sprintService.getSprints(input.teamId),
		initializeSprints: (input) => sprintService.initializeSprints(input.teamId),
		startNextSprint: (input) => sprintService.startNextSprint(input),
		getSprintTasks: (input) => sprintService.getSprintTasks(input.sprintId),
		endSprint: (input) => sprintService.endSprint(input.sprintId),
		addRetrospectiveItem: (input) => sprintService.addRetrospectiveItem(input),
		updateRetrospectiveItem: (input) =>
			sprintService.updateRetrospectiveItem(input),
		getRetrospectiveItems: (input) =>
			sprintService.getRetrospectiveItems(input.sprintId),
	});

export { SprintService };
