import type { Task } from "@repo/db";
import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";

type Params = {
	workspaceId: string;
};

type FilterValue = string | number | Date | boolean | null | string[];

type FilterCondition = {
	field: keyof Task;
	value: FilterValue;
	operator:
		| "equals"
		| "contains"
		| "greaterThan"
		| "lessThan"
		| "arrayIncludesAll"
		| "arrayIncludesAny";
};

type TaskFilter = {
	logic: "AND" | "OR";
	conditions: FilterCondition[];
};

type SavedFilter = {
	id: string;
	workspaceId: string;
	name: string;
	filter: TaskFilter;
};

export function createRoute(): Route<Params> {
	return {
		GET: async (
			res,
			{ workspaceId },
			query,
		): Promise<APIResponse<SavedFilter[]>> => {
			try {
				// Find filters by label ID
				const response = await prisma.savedFilter.findMany({
					where: { workspaceId },
				});

				const filters = response.map((filter) => ({
					...filter,
					filter: filter.filter as TaskFilter,
				}));

				if (!filters) {
					res.status(404);
					return {
						data: filters,
						message: "Teams not found",
						variant: "destructive",
					};
				}

				// Return the found filters
				return {
					data: filters,
					variant: "default",
				};
			} catch (error) {
				console.error("Error finding filters:", error);
				res.status(500);
				return {
					data: null,
					message: "Internal server error",
					variant: "destructive",
				};
			}
		},
	};
}
