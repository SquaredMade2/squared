import type { Sprint } from "@squared/db";
import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";
import { addDays, addWeeks } from "date-fns";

type Params = {
	teamId: string;
};

type InitializeSprintsBody = {
	count?: number;
	startDate?: Date;
};

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { teamId }): Promise<APIResponse<Sprint[]>> => {
			try {
				const team = await prisma.team.findUnique({
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

				if (!team.sprintsEnabled) {
					res.status(400);
					return {
						data: null,
						message: "Sprints are not enabled for this team",
						variant: "destructive",
					};
				}

				const sprints = await prisma.sprint.findMany({
					where: { teamId },
					orderBy: { startDate: "asc" },
				});

				return {
					data: sprints,
					message: `Successfully fetched ${sprints.length} sprints`,
					variant: "default",
				};
			} catch (error) {
				console.error("Error fetching sprints:", error);
				res.status(500);
				return {
					data: null,
					message: "Internal server error",
					variant: "destructive",
				};
			}
		},
		POST: async (
			res,
			{ teamId },
			body: InitializeSprintsBody,
		): Promise<APIResponse<Sprint[]>> => {
			try {
				const team = await prisma.team.findUnique({
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

				if (!team.sprintsEnabled) {
					res.status(400);
					return {
						data: null,
						message: "Sprints are not enabled for this team",
						variant: "destructive",
					};
				}

				const {
					sprintDuration,
					cooldownDuration,
					sprintStartDate,
					upcomingSprints,
				} = team;

				const count = body.count || upcomingSprints;
				let currentStartDate = body.startDate
					? new Date(body.startDate)
					: new Date(sprintStartDate);
				const createdSprints: Sprint[] = [];

				for (let i = 0; i < count; i++) {
					const endDate = addWeeks(currentStartDate, sprintDuration);
					const nextStartDate = addDays(endDate, cooldownDuration);

					const newSprint = await prisma.sprint.create({
						data: {
							name: `Sprint ${i + 1}`,
							startDate: currentStartDate,
							endDate: endDate,
							status: i === 0 ? "ACTIVE" : "PLANNED",
							teamId: teamId,
						},
					});

					createdSprints.push(newSprint);
					currentStartDate = nextStartDate;
				}

				return {
					data: createdSprints,
					message: `Successfully created ${createdSprints.length} sprint${createdSprints.length > 1 ? "s" : ""}`,
					variant: "default",
				};
			} catch (error) {
				console.error("Error initializing sprints:", error);
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
