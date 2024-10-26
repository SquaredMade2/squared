import type { Team } from "@squared/db";
import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";
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
