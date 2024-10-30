import { z } from "zod";
import {
	createRpcHandler,
	createSchema,
	createServiceSchema,
} from "@squared/rpc";
import type {
	NextSprintPayload,
	AddRetrospectivePayload,
	UpdateRetrospectiveItemPayload,
	RetrospectiveData,
	RetroItemReturn,
	SprintRpc,
} from "./types";
import { sprintSchema, taskSchema } from "../schema";

// Define type-safe Zod schemas

const retrospectiveItemReturnSchema = createSchema<RetroItemReturn>()(
	z.object({
		id: z.string(),
		content: z.string(),
		type: z.enum(["toImprove", "wentWell", "actionItems"]),
	}),
);

export const sprintRpcSchema = createServiceSchema<SprintRpc>()({
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
});

export type SprintRpcSchema = typeof sprintRpcSchema;

export const createSprintRpcHandler = (sprintService: SprintRpc) =>
	createRpcHandler("sprint", sprintRpcSchema, {
		getSprints: (input) => sprintService.getSprints(input),
		initializeSprints: (input) => sprintService.initializeSprints(input),
		startNextSprint: (input) => sprintService.startNextSprint(input),
		getSprintTasks: (input) => sprintService.getSprintTasks(input),
		endSprint: (input) => sprintService.endSprint(input),
		addRetrospectiveItem: (input) => sprintService.addRetrospectiveItem(input),
		updateRetrospectiveItem: (input) =>
			sprintService.updateRetrospectiveItem(input),
		getRetrospectiveItems: (input) =>
			sprintService.getRetrospectiveItems(input),
	});

export { SprintService } from "./sprint-service";
