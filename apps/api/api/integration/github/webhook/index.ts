import type { Route } from "@/api/route";
import { prisma } from "@/api";
import { v4 as uuidv4 } from "uuid";

type GitHubWebhookPayload = {
	action?: string;
	repositories?: Array<{
		full_name: string;
		owner: {
			login: string;
		};
	}>;
	repositories_added?: Array<{
		full_name: string;
		owner: {
			login: string;
		};
	}>;
	repositories_removed?: Array<{
		full_name: string;
		owner: {
			login: string;
		};
	}>;
	repository?: {
		full_name: string;
		owner: {
			login: string;
		};
	};
	ref?: string;
	commits?: Array<{
		id: string;
		url: string;
		message: string;
		timestamp: string;
	}>;
	pusher?: { name: string };
	sender?: { login: string };
	installation?: {
		id: number;
		account?: {
			login: string;
		};
	};
};

type Params = Record<string, never>;

export function createRoute(): Route<Params> {
	return {
		POST: async (res, _, body): Promise<void> => {
			console.log("Received POST request for webhook");
			const payload: GitHubWebhookPayload = body;
			const eventType = res.req.headers["x-github-event"];

			console.log(
				"Webhook payload received:",
				JSON.stringify(payload, null, 2),
			);

			if (eventType === "installation_repositories") {
				console.log("Handling repository selection event");

				try {
					const repositories = payload.repositories || [];
					const repositoriesAdded = payload.repositories_added || [];
					const repositoriesRemoved = payload.repositories_removed || [];

					// Log repositories
					// console.log(`Repositories received: ${repositories.length}`);
					// console.log(`Repositories added: ${repositoriesAdded.length}`);
					// console.log(`Repositories removed: ${repositoriesRemoved.length}`);

					const defaultRepoOwner = payload.installation?.account?.login;

					const allRepositories = [
						...repositories,
						...repositoriesAdded,
						...repositoriesRemoved,
					];

					for (const repo of allRepositories) {
						const repoFullName = repo?.full_name;
						const repoOwner = repo?.owner?.login || defaultRepoOwner;

						// handle added or removed repositories from selecting
						if (repoFullName && repoOwner) {
							if (payload.action === "added") {
								const githubRepoInfo = await prisma.githubRepoInfo.findFirst({
									where: { repoName: "selected", owner: repoOwner },
								});

								if (githubRepoInfo) {
									await prisma.githubRepoInfo.update({
										where: { id: githubRepoInfo.id },
										data: { repoName: repoFullName },
									});
								}
							} else if (payload.action === "removed") {
								const githubRepoInfo = await prisma.githubRepoInfo.findFirst({
									where: { repoName: repoFullName, owner: repoOwner },
								});

								if (githubRepoInfo) {
									await prisma.githubRepoInfo.delete({
										where: { id: githubRepoInfo.id },
									});
								}
							}
						} else {
							console.log(
								`Invalid or missing repo data: ${JSON.stringify(repo)}`,
							);
						}
					}

					res
						.status(200)
						.json({ message: "Repositories processed successfully" });
				} catch (error) {
					console.error("Error processing repository selection:", error);
					res.status(500).json({ message: "Internal Server Error" });
				}
				return;
			}

			// Handle branch creation and push events
			const branchName = payload.ref?.split("/").pop();
			const repoFullName = payload.repository?.full_name || "";
			const repoOwner = payload.repository?.owner?.login || "";

			if (eventType === "create" && payload.ref) {
				console.log(
					`Branch ${branchName} created in repository ${repoFullName}`,
				);
			} else if (eventType === "push" && payload.commits) {
				const commitLinks = payload.commits
					.map((commit) => `Commit ${commit.id.substring(0, 7)}: ${commit.url}`)
					.join("\n");

				console.log(
					`Branch ${branchName} updated in repository ${repoFullName} with the following commits:\n${commitLinks}`,
				);
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

						// Check if GithubRepoInfo exists (assumed created during OAuth)
						const githubRepoInfo = await prisma.githubRepoInfo.findFirst({
							where: {
								repoName: repoFullName,
								owner: repoOwner,
								workspaceId: task.workspaceId,
							},
						});

						if (!githubRepoInfo) {
							console.log("No GithubRepoInfo found");
							res.status(404).json({ message: "GithubRepoInfo not found" });
							return;
						}

						// Upsert branch information linked to the task
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

						// Upsert task event log for the task
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

						// Create a new activity related to the event log
						const newActivity = await prisma.activity.create({
							data: {
								id: uuidv4(),
								type: "TASK_EVENT",
								eventLogId: eventLog.id,
							},
						});

						// Create task event for the branch creation or push
						await prisma.taskEvent.create({
							data: {
								type: "gitUpdated",
								authorId: task.authorId,
								authorName,
								taskId: eventLog.id,
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

								// Upsert the commit related to the branch
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
