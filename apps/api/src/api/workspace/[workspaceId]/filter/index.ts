import type { SavedFilter } from "@squared/db";
import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";
import createCustomLogger from "@squared/logger";

type Params = {
	workspaceId: string;
};

const logger = createCustomLogger("workspace");

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { workspaceId }): Promise<APIResponse<SavedFilter[]>> => {
			try {
				// Find filters by label ID
				logger.info("Finding filters by workspace ID: %s", workspaceId);
				const filters = await prisma.savedFilter.findMany({
					where: { workspaceId },
				});

				if (filters.length === 0) {
					return {
						data: null,
						message: "Filters not found",
						variant: "destructive",
					};
				}

				// Return the found filters
				return {
					data: filters,
					variant: "default",
				};
			} catch (error) {
				logger.error("Error finding filters: %0", error);
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
