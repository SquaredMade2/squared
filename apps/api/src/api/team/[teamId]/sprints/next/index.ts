import type { Sprint } from "@squared/db";
import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";
import { addWeeks } from "date-fns";

type Params = {
	teamId: string;
};

type InitializeSprintsBody = {
	movedTasks: string[];
	sprintData?: Partial<Sprint>;
};

export function createRoute(): Route<Params> {
	return {
		PUT: async (
			res,
			{ teamId },
			body: InitializeSprintsBody,
		): Promise<APIResponse<Sprint>> => {
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

				const { sprintDuration } = team;

				const teamSprints = await prisma.sprint.findMany({
					where: { teamId },
					orderBy: { startDate: "asc" },
				});

				const currentSprint = teamSprints.find((s) => s.status === "ACTIVE");

				await prisma.sprint.updateMany({
					where: {
						id: {
							in: teamSprints.map((s) => (s.status === "ACTIVE" ? s.id : "")),
						},
					},
					data: {
						status: "COMPLETED",
					},
				});

				let newSprintData: Sprint | null = null;
				if (body.sprintData?.id) {
					newSprintData = await prisma.sprint.update({
						where: { id: body.sprintData.id },
						data: {
							status: "ACTIVE",
							startDate: new Date(),
							endDate: addWeeks(new Date(), sprintDuration),
							teamId,
							...body.sprintData,
						},
					});
				} else {
					newSprintData = await prisma.sprint.create({
						data: {
							name: `Sprint ${teamSprints.length + 1}`,
							startDate: new Date(),
							endDate: addWeeks(new Date(), sprintDuration),
							status: "ACTIVE",
							teamId,
							...body.sprintData,
						},
					});
				}

				await prisma.task.updateMany({
					where: {
						id: {
							in: body.movedTasks,
						},
						sprintId: currentSprint?.id,
					},
					data: {
						sprintId: newSprintData.id,
					},
				});
				await prisma.task.updateMany({
					where: {
						sprintId: currentSprint?.id,
						status: {
							not: "done",
						},
					},
					data: {
						sprintId: null,
					},
				});

				return {
					data: newSprintData,
					message: `Successfully created sprint: ${newSprintData.name}`,
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
