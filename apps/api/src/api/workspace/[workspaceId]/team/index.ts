import { prisma } from "@/api";
import type { APIResponse, Route } from "@/api/route";
import type { Team } from "@squared/db";
import createCustomLogger from "@squared/logger";

type Params = {
	workspaceId: string;
};

const logger = createCustomLogger("workspace");

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { workspaceId }): Promise<APIResponse<Team>> => {
			try {
				// Find teams by team ID
				logger.info("Finding teams by workspace ID: %s", workspaceId);
				const teams: Team[] = await prisma.team.findMany({
					where: { workspaceId },
				});

				if (teams.length === 0) {
					return {
						data: null,
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
				logger.error("Error finding teams: %0", error);
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
