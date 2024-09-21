import type { SavedFilter as SavedFilterType, Task } from "@repo/db";
import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";

type Params = {
	filterId: string;
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

export type SavedFilter = {
	id: string;
	name: string;
	workspaceId: string;
	filter: TaskFilter;
};

export function createRoute(): Route<Params> {
	return {
		PUT: async (
			res,
			{ filterId },
			body: SavedFilter,
		): Promise<APIResponse<SavedFilterType>> => {
			try {
				const filter = await prisma.savedFilter.update({
					where: { id: filterId },
					data: body,
				});

				if (!filter) {
					return {
						data: null,
						message: "Task not found",
						variant: "destructive",
					};
				}

				// Return the updated task with labels
				return {
					data: filter,
					variant: "default",
				};
			} catch (error) {
				console.error("Error updating task:", error);
				res.status(500);
				return {
					data: null,
					message: "Internal server error",
					variant: "destructive",
				};
			}
		},
		POST: async (
			res,
			{ filterId },
			body,
		): Promise<APIResponse<SavedFilterType>> => {
			try {
				const existingFilter = await prisma.task.findUnique({
					where: { id: filterId },
				});

				if (existingFilter) {
					return {
						data: null,
						message: "Filter already exists",
						variant: "destructive",
					};
				}

				const { id, ...filterData } = body;

				const workspace = await prisma.workspace.findUnique({
					where: { id: body.workspaceId },
				});

				if (!workspace) {
					throw new Error("Workspace not found");
				}

				const newFilter = await prisma.savedFilter.create({
					data: filterData,
				});

				if (!newFilter) {
					res.status(500);
					return {
						data: null,
						message: "Filter not created",
						variant: "destructive",
					};
				}

				// Return the new filter
				return {
					data: newFilter,
					variant: "default",
				};
			} catch (error) {
				console.error("Error creating filter:", error);
				res.status(500);
				return {
					data: null,
					message: "Internal server error",
					variant: "destructive",
				};
			}
		},
		DELETE: async (
			res,
			{ filterId },
		): Promise<APIResponse<SavedFilterType>> => {
			try {
				const filter: SavedFilterType | null = await prisma.savedFilter.delete({
					where: { id: filterId },
				});
				if (!filter) {
					return {
						data: null,
						message: "Filter not found",
						variant: "destructive",
					};
				}

				// Return success message
				return {
					data: null,
					message: "Filter deleted",
					variant: "default",
				};
			} catch (error) {
				console.error("Error deleting task:", error);
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
