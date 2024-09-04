import type { Team } from "@repo/db";
import { prisma } from "@/api";
import type { Route } from "@/api/route";

type Params = {
	teamId: string;
};

type TeamResponse = {
	team : Team | null,
	message?: string,
	variant: "default" | "destructive"
}

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { teamId }, query): Promise<TeamResponse> => {
			try {
				// Find team by ID
				const team: Team | null = await prisma.team.findFirst({
					where: { id: teamId },
				});

				if (!team) {
					return {
						team: null,
						message: "Team not found",
						variant: "destructive"
					};
				}

				// Return the found team
				return {
					team: team,
					variant:"default"
				};
			} catch (error) {
				console.error("Error finding team:", error);
				return {
					team: null,
					message: "Internal Server Error",
					variant: "destructive"
				};
			}
		},
		POST: async (res, { teamId }, body): Promise<TeamResponse> => {
			try {
				const existingTeam = await prisma.team.findFirst({
					where: { id: teamId },
				});

				if (existingTeam) {
					return {
						team: null,
						message: "Team already exists",
						variant: "destructive"
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
					team: newTeam,
					variant:"default"
				};
			} catch (error) {
				console.error("Error creating team:", error);
				return {
					team: null,
					message: "Internal Server Error",
					variant: "destructive"
				};
			}
		},
		PUT: async (res, { teamId }, body): Promise<TeamResponse> => {
			try {
				const team: Team | null = await prisma.team.update({
					where: { id: teamId },
					data: body,
				});

				if (!team) {
					return {
						team: null,
						message: "Team not found",
						variant: "destructive"
					};
				}

				// Return the updated team
				return {
					team: team,
					variant:"default"
				};
			} catch (error) {
				console.error("Error updating team:", error);
				return {
					team: null,
					message: "Internal Server Error",
					variant: "destructive"
				};
			}
		},
		DELETE: async (res, { teamId }): Promise<TeamResponse> => {
			try {
				const team: Team | null = await prisma.team.delete({
					where: { id: teamId },
				});

				if (!team) {
					return {
						team: null,
						message: "Team not found",
						variant: "destructive"
					};
				}

				// Return success message
				return {
					team: null,
					message:"team deleted",
					variant:"default"
				};
			} catch (error) {
				console.error("Error deleting team:", error);
				return {
					team: null,
					message: "Internal Server Error",
					variant: "destructive"
				};
			}
		},
	};
}
