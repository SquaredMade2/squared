import { TODO } from "@squared/context";
import { z } from "zod";
import { router } from "../__internals/router";
import { workspaceProcedure } from "../procedures";

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

const filterConditionSchema = z.object({
	field: z.enum(TaskFields),
	value: FilterValueSchema,
	operator: OperatorSchema,
});

export const filterRouter = router({
	deleteFilter: workspaceProcedure
		.input(z.object({ filterId: z.string() }))
		.mutation(async ({ c, ctx, input }) => {
			const { filterService } = ctx;
			const { filterId } = input;
			await filterService.deleteFilter(TODO, { filterId });

			return c.json({ success: true });
		}),
	updateFilter: workspaceProcedure
		.input(
			z.object({
				filterId: z.string(),
				filters: z.object({
					name: z.string().optional(),
					description: z.string().nullable(),
					filter: z.array(filterConditionSchema),
				}),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { filterService } = ctx;
			const { filterId, filters } = input;
			const updatedFilter = await filterService.updateFilter(TODO, {
				filterId,
				filters,
			});

			return c.json(updatedFilter);
		}),
	createFilter: workspaceProcedure
		.input(
			z.object({
				name: z.string(),
				description: z.string().nullable(),
				filter: z.array(filterConditionSchema).min(1),
				teamId: z.string(),
				sprintId: z.string().nullable(),
			}),
		)
		.mutation(async ({ c, ctx, input }) => {
			const { filterService, userId } = ctx;
			const savedFilter = await filterService.createFilter(TODO, {
				...input,
				authorId: userId,
			});

			return c.json(savedFilter);
		}),
	getFilters: workspaceProcedure
		.input(z.object({ teamId: z.string() }))
		.query(async ({ c, ctx, input }) => {
			const { filterService } = ctx;
			const { teamId } = input;
			const filters = await filterService.getFilters(TODO, { teamId });

			return c.json(filters);
		}),
});
