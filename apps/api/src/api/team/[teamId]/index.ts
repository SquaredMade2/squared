import type { Team } from "@squared/db";
import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";
import createCustomLogger from "@squared/logger";

type Params = {
	teamId: string;
};

const logger = createCustomLogger("team");

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { teamId }): Promise<APIResponse<Team>> => {
			try {
				logger.info("Finding team: %s", teamId);
				// Find team by ID
				const team: Team | null = await prisma.team.findFirst({
					where: { id: teamId },
				});

				if (!team) {
					return {
						data: null,
						message: "Team not found",
						variant: "destructive",
					};
				}

				// Return the found team
				return {
					data: team,
					variant: "default",
				};
			} catch (error) {
				logger.error("Error finding team: %0", error);
				res.status(500);
				return {
					data: null,
					message: "Internal Server Error",
					variant: "destructive",
				};
			}
		},
		POST: async (res, { teamId }, body): Promise<APIResponse<Team>> => {
			try {
				logger.info("Creating team: %s", teamId);
				const existingTeam = await prisma.team.findFirst({
					where: { id: teamId },
				});

				if (existingTeam) {
					return {
						data: null,
						message: "Team already exists",
						variant: "destructive",
					};
				}

				const newTeam = await prisma.team.create({
					data: {
						id: teamId,
						...body,
					} as Team,
				});

				// Return the new task
				return {
					data: newTeam,
					variant: "default",
				};
			} catch (error) {
				logger.error("Error creating team:", error);
				res.status(500);
				return {
					data: null,
					message: "Internal Server Error",
					variant: "destructive",
				};
			}
		},
		PUT: async (res, { teamId }, body): Promise<APIResponse<Team>> => {
			try {
				logger.info("Updating team: %s", teamId);
				const team: Team | null = await prisma.team.update({
					where: { id: teamId },
					data: body,
				});

				if (!team) {
					return {
						data: null,
						message: "Team not found",
						variant: "destructive",
					};
				}

				// Return the updated team
				return {
					data: team,
					variant: "default",
				};
			} catch (error) {
				logger.error("Error updating team:", error);
				res.status(500);
				return {
					data: null,
					message: "Internal Server Error",
					variant: "destructive",
				};
			}
		},
		DELETE: async (res, { teamId }): Promise<APIResponse<Team>> => {
			try {
				logger.info("Deleting team: %s", teamId);
				const team: Team | null = await prisma.team.delete({
					where: { id: teamId },
				});

				if (!team) {
					return {
						data: null,
						message: "Team not found",
						variant: "destructive",
					};
				}

				// Return success message
				return {
					data: null,
					message: "team deleted",
					variant: "default",
				};
			} catch (error) {
				logger.error("Error deleting team:", error);
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
