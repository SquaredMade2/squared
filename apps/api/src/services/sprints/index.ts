import type { Sprint } from "@squared/db";
import {
	createRpcHandler,
	createSchema,
	createServiceSchema,
} from "@squared/rpc";
import { z } from "zod";
import { sprintSchema, taskSchema } from "../schema";
import type {
	AddRetrospectivePayload,
	NextSprintPayload,
	RetroItemReturn,
	RetrospectiveData,
	SprintRpc,
	UpdateRetrospectiveItemPayload,
} from "./types";

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
		input: z.object({ teamId: z.string() }).strict(),
		output: z.array(sprintSchema),
	},
	updateSprint: {
		input: createSchema<{
			sprintId: string;
			sprintData: Pick<
				Sprint,
				"startDate" | "description" | "name" | "endDate"
			>;
		}>()(
			z.object({
				sprintId: z.string(),
				sprintData: sprintSchema.pick({
					name: true,
					startDate: true,
					endDate: true,
					description: true,
				}),
			}),
		).strict(),
		output: sprintSchema,
	},
	initializeSprints: {
		input: z.object({ teamId: z.string() }).strict(),
		output: z.number(),
	},
	startNextSprint: {
		input: createSchema<NextSprintPayload>()(
			z.object({
				teamId: z.string(),
				sprintData: z
					.object({ description: z.string().optional(), name: z.string() })
					.optional(),
			}),
		).strict(),
		output: z.union([
			z.object({
				status: z.number(),
				message: z.string(),
				variant: z.literal("destructive"),
			}).strict(),
			z.object({
				data: sprintSchema,
				message: z.string(),
				variant: z.literal("default"),
			}).strict(),
		]),
	},
	getSprintTasks: {
		input: z.object({ sprintId: z.string() }).strict(),
		output: z.array(taskSchema.strict()),
	},
	endSprint: {
		input: z.object({ sprintId: z.string() }).strict(),
		output: sprintSchema,
	},
	addRetrospectiveItem: {
		input: createSchema<AddRetrospectivePayload>()(
			z.object({
				sprintId: z.string(),
				type: z.enum(["wentWell", "toImprove", "actionItems"]),
				content: z.string(),
			}),
		).strict(),
		output: retrospectiveItemReturnSchema.strict(),
	},
	updateRetrospectiveItem: {
		input: createSchema<UpdateRetrospectiveItemPayload>()(
			z.object({
				retrospectiveItemId: z.string(),
				type: z.enum(["wentWell", "toImprove", "actionItems"]).optional(),
				content: z.string().optional(),
				sprintId: z.string(),
			}).strict(),
		),
		output: retrospectiveItemReturnSchema.strict(),
	},
	getRetrospectiveItems: {
		input: z.object({ sprintId: z.string() }).strict(),
		output: createSchema<RetrospectiveData>()(
			z.object({
				wentWell: z.array(retrospectiveItemReturnSchema),
				toImprove: z.array(retrospectiveItemReturnSchema),
				actionItems: z.array(retrospectiveItemReturnSchema),
			}),
		).strict(),
	},
});

export type SprintRpcSchema = typeof sprintRpcSchema;

export const createSprintRpcHandler = (sprintService: SprintRpc) =>
	createRpcHandler("sprint", sprintRpcSchema, {
		getSprints: (input) => sprintService.getSprints(input),
		updateSprint: (input) => sprintService.updateSprint(input),
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
