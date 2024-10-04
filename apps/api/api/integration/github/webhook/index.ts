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
			const payload: GitHubWebhookPayload = body;
			const eventType = res.req.headers["x-github-event"];

			try {
				if (eventType === "installation_repositories") {
					await handleRepositoryChanges(payload);
					res
						.status(200)
						.json({ message: "Repositories processed successfully" });
					return;
				}

				if (eventType === "create" || eventType === "push") {
					await handleBranchAndCommitEvents(payload, eventType);
					res.status(200).json({ message: "Webhook processed successfully" });
					return;
				}

				res.status(204).json({ message: "No relevant event type" });
			} catch (error) {
				console.error(
					`Error handling webhook: ${error instanceof Error ? error.message : error}`,
				);
				res.status(500).json({
					message: `Error during webhook: ${error instanceof Error && `: ${error.message}`}`,
				});
			}
		},
	};
}

// Handle repository addition and removal
async function handleRepositoryChanges(payload: GitHubWebhookPayload) {
	const repositoriesAdded = payload.repositories_added || [];
	const repositoriesRemoved = payload.repositories_removed || [];
	const githubUsername = payload.installation?.account?.login;

	if (!githubUsername) {
		throw new Error("GitHub username is missing from the payload");
	}

	// Handle repository removal
	for (const repo of repositoriesRemoved) {
		if (!repo.full_name || !githubUsername) {
			console.error(
				`Missing repository data for removal: ${
					!repo.full_name ? "Repository name " : ""
				} ${!githubUsername ? "Repository owner" : ""}`,
			);
			continue;
		}

		// Delete the entry from WorkspaceRepositories where the repo is linked to this specific workspace
		await prisma.workspaceRepositories.deleteMany({
			where: {
				GitHubRepoInfo: {
					repoName: repo.full_name,
					owner: githubUsername,
				},
			},
		});

		// Optionally, check if the repo still exists and delete it only if there are no remaining links
		const remainingLinks = await prisma.workspaceRepositories.count({
			where: {
				GitHubRepoInfo: {
					repoName: repo.full_name,
					owner: githubUsername,
				},
			},
		});

		// Fetch the repository info to ensure it exists before attempting to delete
		const githubRepoInfo = await prisma.githubRepoInfo.findFirst({
			where: {
				repoName: repo.full_name,
				owner: githubUsername,
			},
		});

		if (remainingLinks === 0 && githubRepoInfo) {
			await prisma.githubRepoInfo.delete({
				where: {
					id: githubRepoInfo.id,
				},
			});
		} else {
			console.error(
				`Repository ${repo.full_name} still linked to other workspaces or does not exist.`,
			);
		}
	}

	// Handle repository addition
	for (const repo of repositoriesAdded) {
		if (!repo.full_name || !githubUsername) {
			console.error(
				`Missing repository data for addition: ${
					!repo.full_name ? "Repository name " : ""
				} ${!githubUsername ? "Repository owner" : ""}`,
			);
			continue;
		}

		// Find or create the repository in githubRepoInfo
		let githubRepoInfo = await prisma.githubRepoInfo.findFirst({
			where: { repoName: repo.full_name, owner: githubUsername },
		});

		if (!githubRepoInfo) {
			githubRepoInfo = await prisma.githubRepoInfo.create({
				data: {
					repoName: repo.full_name,
					owner: githubUsername,
				},
			});
		}
	}
}

// Handle branch creation and push events
async function handleBranchAndCommitEvents(
	payload: GitHubWebhookPayload,
	eventType: string,
) {
	const branchName = payload.ref?.split("/").pop();
	const repoFullName = payload.repository?.full_name || "";
	const repoOwner = payload.repository?.owner?.login || "";
	const identifierPattern = /([A-Z]{2,}-\d+)/i;
	const match = branchName?.match(identifierPattern);

	if (!match) {
		throw new Error("No task identifier found in branch name");
	}

	const identifier = match[1].toUpperCase();
	const task = await prisma.task.findFirst({
		where: { identifier: { equals: identifier, mode: "insensitive" } },
		include: { Workspace: true },
	});

	if (!task || !task.workspaceId) {
		throw new Error(`Task ${identifier} not found or has no workspace`);
	}

	// Fetch the GithubRepoInfo for the repo
	const githubRepoInfo = await prisma.githubRepoInfo.findFirst({
		where: { repoName: repoFullName, owner: repoOwner },
	});
	if (!githubRepoInfo) {
		throw new Error("No GithubRepoInfo found for this repository");
	}

	// Link the repository to the workspace if not already linked
	await prisma.workspaceRepositories.upsert({
		where: {
			workspaceId_repoId: {
				workspaceId: task.workspaceId,
				repoId: githubRepoInfo.id,
			},
		},
		update: {},
		create: {
			workspaceId: task.workspaceId,
			repoId: githubRepoInfo.id,
		},
	});

	const existingBranch = await prisma.branch.findFirst({
		where: {
			name: branchName,
			taskId: task.id,
		},
	});

	let branch = existingBranch;

	if (!branch) {
		branch = await prisma.branch.create({
			data: {
				id: uuidv4(),
				name: branchName || "",
				taskId: task.id,
				githubRepoInfoId: githubRepoInfo.id,
			},
		});
	}

	// Upsert task event log for the task
	const eventLog = await prisma.taskEventLog.upsert({
		where: { taskId: task.id },
		update: {},
		create: {
			id: uuidv4(),
			taskId: task.id,
			authorId: task.authorId,
			authorName:
				payload.pusher?.name || payload.sender?.login || "Unknown User",
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
			authorName:
				payload.pusher?.name || payload.sender?.login || "Unknown User",
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
}
