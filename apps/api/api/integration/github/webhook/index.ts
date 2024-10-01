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
					const repositoriesAdded = payload.repositories_added || [];
					const repositoriesRemoved = payload.repositories_removed || [];
					const githubUsername = payload.installation?.account?.login;

					if (!githubUsername) {
						console.error("GitHub username is missing from the payload");
						res.status(400).json({ message: "Missing GitHub username" });
						return;
					}

					// Handle repositories that have been removed
					for (const repo of repositoriesRemoved) {
						const repoFullName = repo.full_name;
						const repoOwner = githubUsername;

						if (!repoFullName || !repoOwner) {
							console.error("Missing repository data for removal");
							continue;
						}

						// Check if the repository exists in the database, remove if exists
						const existingRepoInfo = await prisma.githubRepoInfo.findFirst({
							where: { repoName: repoFullName, owner: repoOwner },
						});

						if (existingRepoInfo) {
							await prisma.githubRepoInfo.delete({
								where: { id: existingRepoInfo.id },
							});
							console.log(`Repository ${repoFullName} removed successfully`);
						}
					}

					// Process repositories that have been added
					for (const repo of repositoriesAdded) {
						const repoFullName = repo.full_name;
						const repoOwner = githubUsername;

						if (!repoFullName || !repoOwner) {
							console.error("Missing repository data for addition");
							continue;
						}

						const existingRepoInfo = await prisma.githubRepoInfo.findFirst({
							where: { repoName: repoFullName, owner: repoOwner },
						});

						if (existingRepoInfo) {
							console.log(
								`Repository ${repoFullName} already exists for owner ${repoOwner}`,
							);
							continue;
						}

						await prisma.githubRepoInfo.create({
							data: {
								repoName: repoFullName,
								owner: repoOwner,
								workspaceId: null,
							},
						});

						console.log(`Repository ${repoFullName} created successfully`);
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
			const identifierPattern = /([A-Z]{2,}-\d+)/i;
			const match = branchName?.match(identifierPattern);

			if (match) {
				const identifier = match[1].toUpperCase();

				try {
					const task = await prisma.task.findFirst({
						where: { identifier: { equals: identifier, mode: "insensitive" } },
					});

					if (task) {
						const authorName =
							payload.pusher?.name || payload.sender?.login || "Unknown User";

						const workspaceId = task.workspaceId;

						const workspace = await prisma.workspace.findFirst({
							where: { id: workspaceId },
							select: { admins: true },
						});

						if (
							!workspace ||
							!workspace.admins ||
							workspace.admins.length === 0
						) {
							console.log("Workspace or admins not found");
							res
								.status(404)
								.json({ message: "Workspace or admins not found" });
							return;
						}

						const workspaceOwnerId = workspace.admins[0];

						const workspaceOwner = await prisma.user.findFirst({
							where: { id: workspaceOwnerId },
							select: { githubUsername: true },
						});

						if (!workspaceOwner || !workspaceOwner.githubUsername) {
							console.log("Workspace owner or GitHub username not found");
							res.status(404).json({
								message: "Workspace owner or GitHub username not found",
							});
							return;
						}

						const pusherUsername =
							payload.pusher?.name || payload.sender?.login;

						if (pusherUsername !== workspaceOwner.githubUsername) {
							console.log("Pusher is not the workspace owner");
							res.status(403).json({
								message:
									"You are not allowed to link this repository to the workspace",
							});
							return;
						}

						// Check if GithubRepoInfo exists for this repository
						const githubRepoInfo = await prisma.githubRepoInfo.findFirst({
							where: {
								repoName: repoFullName,
								owner: repoOwner,
							},
						});

						if (!githubRepoInfo) {
							console.log("No GithubRepoInfo found for this repository");
							res.status(404).json({ message: "GithubRepoInfo not found" });
							return;
						}

						// Check if this repo is already linked to another workspace
						if (
							githubRepoInfo.workspaceId &&
							githubRepoInfo.workspaceId !== workspaceId
						) {
							console.log(
								`Repository ${repoFullName} is already linked to another workspace`,
							);
							res.status(403).json({
								message: `Repository ${repoFullName} is already linked to another workspace`,
							});
							return;
						}

						// Check if this workspace is already linked to another repository
						const existingRepoForWorkspace =
							await prisma.githubRepoInfo.findFirst({
								where: {
									workspaceId: workspaceId,
									repoName: { not: repoFullName },
								},
							});

						if (existingRepoForWorkspace) {
							console.log(
								`Workspace ${workspaceId} is already linked to another repository`,
							);
							res.status(403).json({
								message: `Workspace ${workspaceId} is already linked to another repository`,
							});
							return;
						}

						// Update the workspaceId in GithubRepoInfo if it's null
						if (!githubRepoInfo.workspaceId) {
							await prisma.githubRepoInfo.update({
								where: { id: githubRepoInfo.id },
								data: { workspaceId },
							});
							console.log(
								`Workspace ID ${workspaceId} added to GithubRepoInfo for repository ${repoFullName}`,
							);
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
