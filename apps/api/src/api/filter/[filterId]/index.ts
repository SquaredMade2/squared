import type {
	SavedFilter as SavedFilterType,
	Task,
	Team,
	Workspace,
} from "@squared/db";
import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";
import createCustomLogger from "@squared/logger";

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

type SavedFilter = Omit<SavedFilterType, "filter"> & {
	filter: FilterCondition[];
};

const logger = createCustomLogger("filter");

export function createRoute(): Route<Params> {
	return {
		PUT: async (
			res,
			{ filterId },
			body: SavedFilter,
		): Promise<APIResponse<SavedFilterType>> => {
			try {
				logger.info("Updating filter: %0", { filterId, body });
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
				logger.error("Error updating task: %0", error);
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
				logger.info("Creating filter: %0", { filterId, body });
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
				let parent: Team | Workspace | null;
				if (body.workspaceId) {
					parent = await prisma.workspace.findUnique({
						where: { id: body.workspaceId },
					});
				} else if (body.teamId) {
					parent = await prisma.team.findUnique({
						where: { id: body.teamId },
					});
				} else {
					return {
						data: null,
						message: "Must provide workspace or team",
						variant: "destructive",
					};
				}

				if (!parent) {
					throw new Error("Parent not found");
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
				logger.error("Error creating filter: %0", error);
				res.status(500);
				return {
					data: null,
					message: "Internal server error",
					variant: "destructive",
				};
			}
		},
		GET: async (res, { filterId }): Promise<APIResponse<SavedFilterType>> => {
			try {
				logger.info("Fetching filter: %s", filterId);
				const filter = await prisma.savedFilter.findMany({
					where: {
						OR: [{ teamId: filterId }, { workspaceId: filterId }],
					},
				});

				if (!filter) {
					return {
						data: null,
						message: "Filter not found",
						variant: "destructive",
					};
				}

				// Return the filter
				return {
					data: filter,
					variant: "default",
				};
			} catch (error) {
				logger.error("Error fetching filter: %0", error);
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
				logger.info("Deleting filter: %s", filterId);
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
				logger.error("Error deleting task: %0", error);
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
