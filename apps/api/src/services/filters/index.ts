import { createRpcHandler, createServiceSchema } from "@squared/rpc";
import { z } from "zod";
import { filterSchema } from "../schema";
import type { FilterRpc } from "./types";

export const filterRpcSchema = createServiceSchema<FilterRpc>()({
	getFilter: {
		input: z.object({
			workspaceId: z.string().optional(),
			teamId: z.string().optional(),
		}),
		output: z.array(filterSchema),
	},
	updateFilter: {
		input: filterSchema,
		output: filterSchema,
	},
	createFilter: {
		input: filterSchema,
		output: filterSchema,
	},
	deleteFilter: {
		input: filterSchema,
		output: filterSchema,
	},
});

export type FilterRpcSchema = typeof filterRpcSchema;

export const createFilterRpcHandler = (filterService: FilterRpc) =>
	createRpcHandler("filter", filterRpcSchema, {
		getFilter: (input) => filterService.getFilter(input),
		updateFilter: (input) => filterService.updateFilter(input),
		createFilter: (input) => filterService.createFilter(input),
		deleteFilter: (input) => filterService.deleteFilter(input),
	});
