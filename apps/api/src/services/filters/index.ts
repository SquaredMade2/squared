import {
	createRpcHandler,
	createSchema,
	createServiceSchema,
} from "@squaredmade/rpc";
import z from "zod";
import type { FilterCondition, FilterRpc, SavedFilter } from "./types";

const FilterValueSchema = z.union([
	z.string(),
	z.number(),
	z.date(),
	z.boolean(),
	z.null(),
	z.array(z.union([z.string(), z.null()])),
	z.array(z.string()),
]);

const TaskFields = [
	"id",
	"title",
	"description",
	"status",
	"sprintId",
	"teamId",
	"updatedAt",
	"authorId",
	"identifier",
	"dueDate",
	"effortEstimate",
	"priority",
	"dateCreated",
	"assigneeId",
	"labels",
	"workspaceId",
	"parentId",
	"deleted",
	"order",
] as const;

// Define the operator schema
const OperatorSchema = z.enum([
	"equals",
	"contains",
	"greaterThan",
	"lessThan",
	"arrayIncludesAll",
	"arrayIncludesAny",
]);

// Define the FilterCondition schema
const filterConditionSchema = createSchema<FilterCondition>()(
	z.object({
		field: z.enum(TaskFields),
		value: FilterValueSchema,
		operator: OperatorSchema,
	}),
);

const savedFilterSchema = createSchema<SavedFilter>()(
	z.object({
		id: z.string(),
		name: z.string(),
		description: z.string().nullable(),
		type: z.enum(["TEAM", "WORKSPACE"]),
		filter: z.array(filterConditionSchema).min(1),
		workspaceId: z.string().nullable(),
		teamId: z.string().nullable(),
		authorId: z.string(),
		sprintId: z.string().nullable(),
	}),
);

export const filterRpcSchema = createServiceSchema<FilterRpc>()({
	createFilter: {
		input: z.object({
			name: z.string(),
			description: z.string().nullable(),
			filter: z.array(filterConditionSchema).min(1),
			teamId: z.string(),
			authorId: z.string(),
			sprintId: z.string().nullable(),
		}),
		output: savedFilterSchema,
	},
	getFilters: {
		input: z.object({ teamId: z.string() }),
		output: z.array(savedFilterSchema),
	},
	updateFilter: {
		input: z.object({
			filterId: z.string(),
			filters: z.object({
				name: z.string().optional(),
				description: z.string().nullable(),
				filter: z.array(filterConditionSchema).min(1),
			}),
		}),
		output: savedFilterSchema,
	},
	deleteFilter: {
		input: z.object({ filterId: z.string() }),
		output: z.void(),
	},
});

export const FilterRpcSchema = typeof filterRpcSchema;

export const createFilterRpcHandler = (filterService: FilterRpc) =>
	createRpcHandler("filter", filterRpcSchema, {
		createFilter: (input) => filterService.createFilter(input),
		getFilters: (input) => filterService.getFilters(input),
		updateFilter: (input) => filterService.updateFilter(input),
		deleteFilter: (input) => filterService.deleteFilter(input),
	});

export { FilterService } from "./filter-service";
