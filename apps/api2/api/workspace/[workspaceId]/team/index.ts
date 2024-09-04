import type { Team } from "@repo/db";
import { prisma } from "@/api";
import type { Route } from "@/api/route";

type Params = {
	workspaceId: string;
};

type TeamResponse = {
	teams : Team[] | null,
	message?: string,
	variant: "default" | "destructive"
}

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { workspaceId }, query): Promise<TeamResponse> => {
			try {
				// Find teams by team ID
				const teams: Team[] | null = await prisma.team.findMany({
					where: { workspaceId },
				});

				if (!teams) {
					return {
						teams: teams,
						message:"Teams not found",
						variant: "destructive"
					};
				}

				// Return the found teams
				return {
					teams: teams,
					variant: "default"
				};
			} catch (error) {
				console.error("Error finding teams:", error);
				return {
					teams: null,
					message: "Internal server error",
					variant: "destructive"
				};
			}
		},
	};
}
