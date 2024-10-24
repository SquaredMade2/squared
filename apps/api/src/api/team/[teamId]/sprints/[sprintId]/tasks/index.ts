import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";
import type { Sprint, Status, Task } from "@squared/db";

type Params = {
	teamId: string;
	sprintId: string;
};

type UpdateSprintTasksBody = {
	type: "add" | "remove";
};

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { teamId, sprintId }): Promise<APIResponse<Task[]>> => {
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

				const tasks = await prisma.task.findMany({
					where: {
						teamId,
						sprintId,
					},
				});
				return {
					data: tasks,
					message: `Successfully fetched ${tasks.length} tasks`,
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
		PUT: async (
			res,
			{ teamId, sprintId },
			body: UpdateSprintTasksBody,
		): Promise<APIResponse<boolean>> => {
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

				const tasks = await prisma.task.findMany({
					where: {
						teamId,
					},
				});

				switch (body.type) {
					case "add": {
						const tasksToAdd = tasks.filter(
							(task) =>
								!task.sprintId &&
								["todo", "inProgress", "inReview"].includes(task.status),
						);
						const updatedTasks = await prisma.task.updateMany({
							where: {
								id: {
									in: tasksToAdd.map((task) => task.id),
								},
							},
							data: {
								sprintId,
							},
						});

						return {
							data: true,
							message: `Successfully added ${updatedTasks.count} tasks to the current active sprint`,
							variant: "default",
						};
					}
					case "remove": {
						const tasksToRemove = tasks.filter(
							(task) => task.sprintId === sprintId,
						);
						const updatedTasks = await prisma.task.updateMany({
							where: {
								id: {
									in: tasksToRemove.map((task) => task.id),
								},
							},
							data: {
								sprintId: null,
							},
						});
						const currentSprint = await prisma.sprint.update({
							where: {
								id: sprintId,
							},
							data: {
								status: "COMPLETED",
							},
						});

						return {
							data: true,
							message: `Successfully removed ${updatedTasks.count} tasks from ${currentSprint?.name || "the current active"} sprint`,
							variant: "default",
						};
					}
				}
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
		DELETE: async (res, { teamId, sprintId }): Promise<APIResponse<Sprint>> => {
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

				const unfinishedStatuses: Status[] = [
					"backlog",
					"todo",
					"inProgress",
					"inReview",
				];

				await prisma.task.updateMany({
					where: {
						teamId,
						sprintId,
						status: {
							in: unfinishedStatuses,
						},
					},
					data: {
						sprintId: null,
					},
				});
				const updatedSprint = await prisma.sprint.update({
					where: {
						id: sprintId,
					},
					data: {
						status: "COMPLETED",
					},
				});
				return {
					data: updatedSprint,
					message: "Successfully ended the sprint",
					variant: "default",
				};
			} catch (error) {
				console.error("Error updating sprint:", error);
				res.status(500);
				throw new Error("Internal server error");
			}
		},
	};
}
