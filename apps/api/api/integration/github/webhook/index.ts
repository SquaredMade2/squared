import type { Route } from "@/api/route";
import { prisma } from "@/api";
import { v4 as uuidv4 } from "uuid";

type GitHubWebhookPayload = {
	ref?: string;
	repository?: {
		full_name: string;
		owner: {
			login: string;
		};
	};
	commits?: Array<{
		id: string;
		url: string;
		message: string;
		timestamp: string;
	}>;
	pusher?: { name: string };
	sender?: { login: string };
};

type Params = Record<string, never>;

export function createRoute(): Route<Params> {
	return {
		POST: async (res, _, body): Promise<void> => {
			console.log("Received POST request for webhook");
			const payload: GitHubWebhookPayload = body;
			const eventType = res.req.headers["x-github-event"];
			const branchName = payload.ref?.split("/").pop();
			const repoFullName = payload.repository?.full_name || "";
			const repoOwner = payload.repository?.owner.login || "";
			let gitUpdated = ""; // String for storing branch creation/push event GitHub updates

			console.log(
				"Webhook payload received:",
				JSON.stringify(payload, null, 2),
			);

			// Determine event type (branch creation or push)
			if (eventType === "create" && payload.ref) {
				gitUpdated = `Branch ${branchName} created in repository ${repoFullName}`;
			} else if (eventType === "push" && payload.commits) {
				const commitLinks = payload.commits
					.map((commit) => `Commit ${commit.id.substring(0, 7)}: ${commit.url}`)
					.join("\n");

				gitUpdated = `Branch ${branchName} updated in repository ${repoFullName} with the following commits:\n${commitLinks}`;
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

						// Check if GithubRepoInfo exists or create it
						let githubRepoInfo = await prisma.githubRepoInfo.findFirst({
							where: {
								repoName: repoFullName,
								owner: repoOwner,
								workspaceId: task.workspaceId,
							},
						});

						if (!githubRepoInfo) {
							githubRepoInfo = await prisma.githubRepoInfo.create({
								data: {
									id: uuidv4(),
									repoName: repoFullName,
									owner: repoOwner,
									workspaceId: task.workspaceId,
								},
							});
						}

						const branch = await prisma.branch.upsert({
							where: {
								taskId: task.id,
							},
							update: {
								name: branchName || "",
								githubRepoInfoId: githubRepoInfo.id,
							},
							create: {
								id: uuidv4(),
								name: branchName || "",
								taskId: task.id,
								githubRepoInfoId: githubRepoInfo.id,
							},
						});

						const eventLog = await prisma.taskEventLog.upsert({
							where: {
								taskId: task.id,
							},
							update: {},
							create: {
								id: uuidv4(),
								taskId: task.id,
								authorId: task.authorId,
								authorName: authorName,
							},
						});

						const newActivity = await prisma.activity.create({
							data: {
								id: uuidv4(),
								type: "TASK_EVENT",
								eventLogId: eventLog.id,
							},
						});

						await prisma.taskEvent.create({
							data: {
								type: "gitUpdated",
								authorId: task.authorId,
								authorName,
								taskId: eventLog.id,
								gitUpdated,
								activityId: newActivity.id,
							},
						});

						// Handle commits if it's a push event
						if (eventType === "push" && payload.commits) {
							for (const commit of payload.commits) {
								const commitActivity = await prisma.activity.create({
									data: {
										id: uuidv4(),
										type: "COMMIT",
										eventLogId: eventLog.id,
									},
								});

								await prisma.commit.upsert({
									where: { id: commit.id },
									update: {
										message: commit.message,
										timestamp: commit.timestamp,
										url: commit.url,
										authorName: payload.pusher?.name,
									},
									create: {
										id: commit.id,
										message: commit.message,
										timestamp: commit.timestamp,
										url: commit.url,
										authorName: payload.pusher?.name,
										treeId: branch.id,
										repoName: repoFullName,
										owner: repoOwner,
										activityId: commitActivity.id,
									},
								});
							}
						}

						console.log(`Branch and commits processed for task ${identifier}`);
						res.status(200).json({ message: "Webhook processed successfully" });
					} else {
						console.log(`No task found for identifier ${identifier}`);
						res.status(404).json({ message: `Task ${identifier} not found` });
					}
				} catch (error) {
					console.error("Error handling webhook:", error);
					res.status(500).json({ message: "Internal Server Error" });
					return;
				}
			} else {
				console.log("No task identifier found in branch name");
				res.status(200).json({ message: "No task identifier found" });
			}
		},
	};
}
