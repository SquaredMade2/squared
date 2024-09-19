import type { Team } from "@repo/db";
import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";

type Params = {
	workspaceId: string;
};

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { workspaceId }, query): Promise<APIResponse<Team>> => {
			try {
				// Find teams by team ID
				const teams: Team[] | null = await prisma.team.findMany({
					where: { workspaceId },
				});

				if (!teams) {
					return {
						data: teams,
						message: "Teams not found",
						variant: "destructive",
					};
				}

				// Return the found teams
				return {
					data: teams,
					variant: "default",
				};
			} catch (error) {
				console.error("Error finding teams:", error);
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
