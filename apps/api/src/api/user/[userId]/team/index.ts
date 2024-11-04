import type { Team } from "@squared/db";
import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";

type Params = {
	userId: string;
};

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { userId }): Promise<APIResponse<Team>> => {
			try {
				// Find teams a certain user belongs to

				const userTeams: Team[] = await prisma.userTeam
					.findMany({
						where: { userId },
						include: {
							team: true,
						},
					})
					.then((teams) => teams.map((team) => team.team));

				if (!userTeams) {
					return {
						data: null,
						message: "Team not found",
						variant: "destructive",
					};
				}

				// Return the found teams
				return {
					data: userTeams,
					message: "",
					variant: "default",
				};
			} catch (error) {
				console.error("Error finding user teams:", error);
				res.status(500);
				return {
					data: null,
					message: "Internal Sever Error",
					variant: "destructive",
				};
			}
		},
	};
}
