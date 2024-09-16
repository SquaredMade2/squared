import type { Team } from "@repo/db";
import { prisma } from "../..";
import type { Route, APIResponse } from "../../route";

type Params = {
	teamId: string;
};

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { teamId }, query): Promise<APIResponse<Team>> => {
			try {
				// Find team by ID
				const team: Team | null = await prisma.team.findFirst({
					where: { id: teamId },
				});

				if (!team) {
					res.status(404);
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
				console.error("Error finding team:", error);
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
				const existingTeam = await prisma.team.findFirst({
					where: { id: teamId },
				});

				if (existingTeam) {
					res.status(401);
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
				console.error("Error creating team:", error);
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
				const team: Team | null = await prisma.team.update({
					where: { id: teamId },
					data: body,
				});

				if (!team) {
					res.status(404);
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
				console.error("Error updating team:", error);
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
				const team: Team | null = await prisma.team.delete({
					where: { id: teamId },
				});

				if (!team) {
					res.status(404);
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
				console.error("Error deleting team:", error);
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
