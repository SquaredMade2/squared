import type { Prisma, Task } from "@repo/db";
import { prisma } from "@/api";
import type { Route } from "@/api/route";
import { v4 as uuidv4 } from "uuid";

type Params = {
	taskId: string;
};

type ActivityType = Prisma.ActivityGetPayload<{
	include: { taskEvent: true; commit: true };
}>;

export function createRoute(): Route<Params> {
	return {
		GET: async ({ taskId }) => {
			try {
				// Find the task by its ID
				const task: Task | null = await prisma.task.findUnique({
					where: { id: taskId },
				});

				if (!task) {
					throw new Error("Task not found");
				}

				// Find all the activities associated with the task
				const taskEventLogWithActivities = await prisma.taskEventLog.findFirst({
					where: { taskId },
					include: {
						activities: true,
					},
				});

				if (!taskEventLogWithActivities) {
					throw new Error("Task event log not found");
				}

				// Return the found activities
				return taskEventLogWithActivities.activities;
			} catch (error) {
				console.error("Error finding task:", error);
				throw new Error("Internal server error");
			}
		},
		POST: async ({ taskId }, body) => {
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
					return newActivityWithCommit;
				}
				if (body.type === "TASK_EVENT") {
					// Assuming that taskEvent should be eagerly loaded
					const newActivityWithTaskEvent = await prisma.activity.findUnique({
						where: { id: newActivity.id },
						include: { taskEvent: true },
					});
					return newActivityWithTaskEvent;
				}

				throw new Error("Invalid activity type");
			} catch (error) {
				console.error("Error creating task:", error);
				throw new Error("Internal server error");
			}
		},
	};
}
