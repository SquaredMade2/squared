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
import { logger } from "../index";

// Define type-safe Zod schemas

const retrospectiveItemReturnSchema = createSchema<RetroItemReturn>()(
	z.object({
		id: z.string(),
		authorId: z.string(),
		content: z.string(),
		type: z.enum(["toImprove", "wentWell", "actionItems"]),
		likes: z.array(z.string()),
	}),
);

export const sprintRpcSchema = createServiceSchema<SprintRpc>()({
	getSprints: {
		input: z.object({ teamId: z.string() }),
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
		),
		output: sprintSchema,
	},
	initializeSprints: {
		input: z.object({ teamId: z.string() }),
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
		),
		output: z.union([
			z
				.object({
					status: z.number(),
					message: z.string(),
					variant: z.literal("destructive"),
				})
				.strict(),
			z
				.object({
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
				authorId: z.string(),
				type: z.enum(["wentWell", "toImprove", "actionItems"]),
				content: z.string(),
			}),
		),
		output: retrospectiveItemReturnSchema,
	},
	updateRetrospectiveItem: {
		input: createSchema<UpdateRetrospectiveItemPayload>()(
			z
				.object({
					retrospectiveItemId: z.string(),
					type: z.enum(["wentWell", "toImprove", "actionItems"]).optional(),
					content: z.string().optional(),
					sprintId: z.string(),
				}),
		),
		output: retrospectiveItemReturnSchema,
	},
	likeRetrospectiveItem: {
		input: createSchema<{
			retrospectiveItemId: string;
			userId: string;
		}>()(
			z.object({
				retrospectiveItemId: z.string(),
				userId: z.string(),
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
		updateSprint: (input) => sprintService.updateSprint(input),
		initializeSprints: (input) => sprintService.initializeSprints(input),
		startNextSprint: (input) => sprintService.startNextSprint(input),
		getSprintTasks: (input) => sprintService.getSprintTasks(input),
		endSprint: (input) => sprintService.endSprint(input),
		addRetrospectiveItem: (input) => sprintService.addRetrospectiveItem(input),
		updateRetrospectiveItem: (input) =>
			sprintService.updateRetrospectiveItem(input),
		likeRetrospectiveItem: (input) =>
			sprintService.likeRetrospectiveItem(input),
		getRetrospectiveItems: (input) =>
			sprintService.getRetrospectiveItems(input),
	}, logger);

export { SprintService } from "./sprint-service";
