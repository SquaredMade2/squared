import type { SavedFilter, Task } from "@repo/db";
import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";

type Params = {
	workspaceId: string;
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
				const filters = await prisma.savedFilter.findMany({
					where: { workspaceId },
				});

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
