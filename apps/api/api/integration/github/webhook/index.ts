import type { Route } from "@/api/route";
import { prisma } from "@/api";
import type { TaskEventLog, Activity, TaskEvent } from "@repo/db";
import { v4 as uuidv4 } from "uuid";

type GitHubWebhookPayload = {
	ref?: string;
	repository?: {
		full_name: string;
	};
	commits?: Array<{ id: string; url: string }>;
	pusher?: { name: string };
	sender?: { login: string };
};

type Params = Record<string, never>;

export function createRoute(): Route<Params> {
	return {
		POST: async (res, _, body): Promise<void> => {
			console.log("Received POST request for webhook");
			console.log("Request body:", body);
			const payload: GitHubWebhookPayload = body;
			const eventType = res.req.headers["x-github-event"];
			const branchName = payload.ref?.split("/").pop();
			let gitUpdated = ""; //String for storing branch creation/push event github updates

			console.log(
				"Webhook payload received:",
				JSON.stringify(payload, null, 2),
			);

			// Determine event type (branch creation or push)
			if (eventType === "create" && payload.ref) {
				gitUpdated = `Branch ${branchName} created in repository ${payload.repository?.full_name}`;
			} else if (eventType === "push" && payload.commits) {
				const commitLinks = payload.commits
					.map((commit) => `Commit ${commit.id.substring(0, 7)}: ${commit.url}`)
					.join("\n");

				gitUpdated = `Branch ${branchName} updated in repository ${payload.repository?.full_name} with the following commits:\n${commitLinks}`;
			} else {
				console.log("No relevant event type");
				res.status(200).json({ message: "No relevant event type" });
				return;
			}

			// Extract task identifier from branch name
			const identifierPattern = /([A-Z]{2,}-\d+)/i;
			const match = branchName?.match(identifierPattern);

			if (match) {
				const identifier = match[1].toUpperCase();

				try {
					// Find the task by the extracted identifier
					const task = await prisma.task.findFirst({
						where: { identifier: { equals: identifier, mode: "insensitive" } },
					});

					if (task) {
						const authorName =
							payload.pusher?.name || payload.sender?.login || "Unknown User";

						// Check or create TaskEventLog for the task
						const eventLog = await prisma.taskEventLog.upsert({
							where: {
								taskId: task.id,
							},
							update: {},
							create: {
								taskId: task.id,
								authorId: task.authorId, // Original task's authorId
								authorName: authorName, // The name of the person who triggered the event
							} as TaskEventLog,
						});

						// Create new Activity
						const newActivity = await prisma.activity.create({
							data: {
								id: uuidv4(),
								type: "TASK_EVENT",
								eventLogId: eventLog.id, // Link to TaskEventLog
							} as Activity,
						});

						// Create new TaskEvent (logs GitHub updates like branch creation/push)
						const newTaskEvent = await prisma.taskEvent.create({
							data: {
								type: "gitUpdated",
								authorId: task.authorId, // Task author's ID
								authorName, // Name of the GitHub pusher or sender
								taskId: eventLog.id, // Link to TaskEventLog ID
								gitUpdated, // Store the gitUpdated string directly
								activityId: newActivity.id, // Link to Activity
							} as TaskEvent,
						});

						console.log(`Task event created for task ${identifier}`);
					} else {
						console.log(`No task found for identifier ${identifier}`);
					}
				} catch (error) {
					console.error("Error handling webhook:", error);
					res.status(500).json({ message: "Internal Server Error" });
					return;
				}
			} else {
				console.log("No task identifier found in branch name");
			}

			res.status(200).json({ message: "Webhook received" });
		},
	};
}
