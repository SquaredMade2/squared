import type { Prisma, Task } from "@repo/db";
import { prisma } from "@/api";
import type { Route } from "@/api/route";
import { v4 as uuidv4 } from "uuid";
import { Activity } from "@repo/test-db";

type Params = {
	taskId: string;
};

type ActivityType = Prisma.ActivityGetPayload<{
	include: { taskEvent: true; commit: true };
}>;

type ActivityReturn = {
	activity : Activity | Activity[] | null,
	message: string,
	variant: "default" | "destructive"
}

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { taskId }): Promise<ActivityReturn> => {
			try {
				// Find the task by its ID
				const task: Task | null = await prisma.task.findUnique({
					where: { id: taskId },
				});

				if (!task) {
					return {
						activity: null,
						message:"Task not found",
						variant:"destructive"
					};
				}

				// Find all the activities associated with the task
				const taskEventLogWithActivities = await prisma.taskEventLog.findFirst({
					where: { taskId },
					include: {
						activities: true,
					},
				});

				if (!taskEventLogWithActivities) {
					return {
						activity: null,
						message:"Task event log not found",
						variant:"destructive"
					};
				}

				// Return the found activities
				return {
					activity: taskEventLogWithActivities.activities,
					message:"",
					variant:"default"
				}
			} catch (error) {
				console.error("Error finding task:", error);
				return {
					activity: null,
					message:"Internal server error",
					variant:"destructive"
				};
			}
		},
		POST: async (res, { taskId }, body): Promise<ActivityReturn> => {
			try {
				const task = await prisma.task.findUnique({
					where: { id: taskId },
				});

				if (!task) {
					throw new Error("Task not found");
				}

				// Check if a TaskEventLog exists for the task
				let taskEventLog = await prisma.taskEventLog.findFirst({
					where: { taskId },
				});

				// If no TaskEventLog exists, create a new one
				if (!taskEventLog) {
					taskEventLog = await prisma.taskEventLog.create({
						data: {
							taskId: task.id,
							authorId: task.authorId,
							authorName: body.author,
						},
					});
				}

				// Create a new activity
				const newActivity = await prisma.activity.create({
					data: {
						id: uuidv4(),
						type: body.type,
						eventLogId: taskEventLog.id,
						commit: body.type === "COMMIT" ? { create: body.event } : undefined,
						taskEvent:
							body.type === "TASK_EVENT" ? { create: body.event } : undefined,
					},
				});

				if (body.type === "COMMIT") {
					// Assuming that commit should be eagerly loaded
					const newActivityWithCommit = await prisma.activity.findUnique({
						where: { id: newActivity.id },
						include: { commit: true },
					});
					return {
						activity: newActivityWithCommit,
						message:"",
						variant:"default"
					}
				}
				if (body.type === "TASK_EVENT") {
					// Assuming that taskEvent should be eagerly loaded
					const newActivityWithTaskEvent = await prisma.activity.findUnique({
						where: { id: newActivity.id },
						include: { taskEvent: true },
					});
					return {
						activity:newActivityWithTaskEvent,
						message:"",
						variant:"default"
					};
				}

				throw new Error("Invalid activity type");
			} catch (error) {
				console.error("Error creating task:", error);
				throw new Error("Internal server error");
			}
		},
	};
}
