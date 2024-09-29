import type { Sprint } from "@repo/db";
import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";

type Params = {
	teamId: string;
};

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { teamId }): Promise<APIResponse<Sprint>> => {
			try {
				// Find sprints by team ID
				const sprints = await prisma.sprint.findMany({
					where: { teamId },
				});

				if (!sprints) {
					return {
						data: null,
						message: "Sprints not found",
						variant: "destructive",
					};
				}

				// Return the found sprints
				return {
					data: sprints,
					variant: "default",
				};
			} catch (error) {
				console.error("Error finding sprints:", error);
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
