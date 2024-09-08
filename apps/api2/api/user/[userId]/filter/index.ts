import type { Filter, Label, Task, User } from "@repo/db";
import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";

type Params = {
	userId: string;
};

type FilterValue = string | number | Date | boolean | null | Label[];

export type FilterCondition = {
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

export type TaskFilter = {
	id?: string;
	logic: "AND" | "OR";
	conditions: FilterCondition[];
};

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { userId }): Promise<APIResponse<TaskFilter>> => {
			try {
				// Find the user by their ID
				const user: User | null = await prisma.user.findUnique({
					where: { id: userId },
				});

				if (!user) {
					res.status(404);
					return {
						data: null,
						message: "User not found",
						variant: "destructive",
					};
				}

				// Find filters assigned to user
				const rawFilters: Filter[] = await prisma.filter.findMany({
					where: { userId },
				});
				const filters = rawFilters.map((filter) => ({
					id: filter.id,
					logic: filter.logic,
					conditions:
						typeof filter.conditions === "string"
							? JSON.parse(filter.conditions)
							: filter.conditions,
				}));

				// Return the found filters
				return {
					data: filters,
					variant: "default",
				};
			} catch (error) {
				console.error("Error finding notifications:", error);
				res.status(500);
				return {
					data: null,
					message: "Internal Server Error",
					variant: "destructive",
				};
			}
		},
	};
}
