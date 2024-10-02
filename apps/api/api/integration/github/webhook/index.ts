import type { Route } from "@/api/route";
import type { Task } from "@repo/db";
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
		await prisma.githubRepoInfo.deleteMany({
			where: { repoName: repo.full_name, owner: githubUsername },
		});
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
		const existingRepoInfo = await prisma.githubRepoInfo.findFirst({
			where: { repoName: repo.full_name, owner: githubUsername },
		});

		if (existingRepoInfo) {
			console.error(
				`Repository ${repo.full_name} already exists for owner ${githubUsername}`,
			);
			continue;
		}

		await prisma.githubRepoInfo.create({
			data: {
				repoName: repo.full_name,
				owner: githubUsername,
				workspaceId: null,
			},
		});
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
	});

	if (!task) {
		throw new Error(`Task ${identifier} not found`);
	}

	// Check workspace ownership and return early if it fails
	const isValidOwnership = await validateWorkspaceOwnership(
		payload,
		task,
		repoFullName,
		repoOwner,
	);
	if (!isValidOwnership) {
		throw new Error(
			"Invalid workspace ownership, pusher is not owner of workspace",
		);
	}

	const githubRepoInfo = await prisma.githubRepoInfo.findFirst({
		where: { repoName: repoFullName, owner: repoOwner },
	});
	if (!githubRepoInfo) {
		throw new Error("No GithubRepoInfo found for this repository");
	}

	// Upsert branch information linked to the task
	const branch = await prisma.branch.upsert({
		where: { taskId: task.id },
		update: { name: branchName || "", githubRepoInfoId: githubRepoInfo.id },
		create: {
			id: uuidv4(),
			name: branchName || "",
			taskId: task.id,
			githubRepoInfoId: githubRepoInfo.id,
		},
	});

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

// Validate workspace ownership and restrictions
async function validateWorkspaceOwnership(
	payload: GitHubWebhookPayload,
	task: Task,
	repoFullName: string,
	repoOwner: string,
): Promise<boolean> {
	const workspaceId = task.workspaceId;

	const workspace = await prisma.workspace.findFirst({
		where: { id: workspaceId },
		select: { admins: true },
	});

	if (!workspace || workspace.admins.length === 0) {
		throw new Error("Workspace or admins not found");
	}

	const workspaceOwnerId = workspace.admins[0];
	const workspaceOwner = await prisma.user.findFirst({
		where: { id: workspaceOwnerId },
		select: { githubUsername: true },
	});

	if (!workspaceOwner || !workspaceOwner.githubUsername) {
		console.error(
			`Workspace owner or GitHub username not found: ${
				!workspaceOwner ? "workspaceOwner" : ""
			} ${!workspaceOwner?.githubUsername ? "workspaceOwner.githubUsername" : ""}`,
		);
		return false;
	}

	const pusherUsername = payload.pusher?.name || payload.sender?.login;

	if (pusherUsername !== workspaceOwner.githubUsername) {
		console.error("Pusher is not the workspace owner");
		return false;
	}

	// Check if GithubRepoInfo exists for this repository
	const githubRepoInfo = await prisma.githubRepoInfo.findFirst({
		where: { repoName: repoFullName, owner: repoOwner },
	});

	if (!githubRepoInfo) {
		console.error("No GithubRepoInfo found for this repository");
		return false;
	}

	// Check if this repo is already linked to another workspace
	if (
		githubRepoInfo?.workspaceId &&
		githubRepoInfo.workspaceId !== workspaceId
	) {
		throw new Error(
			`Repository ${repoFullName} is already linked to another workspace`,
		);
	}
	// Check if this workspace is already linked to another repository
	const existingRepoForWorkspace = await prisma.githubRepoInfo.findFirst({
		where: {
			workspaceId: workspaceId,
			repoName: { not: repoFullName },
		},
	});

	if (existingRepoForWorkspace) {
		console.error(
			`Workspace ${workspaceId} is already linked to another repository`,
		);
		return false;
	}

	// Update the workspaceId in GithubRepoInfo if it's null
	if (!githubRepoInfo.workspaceId) {
		await prisma.githubRepoInfo.update({
			where: { id: githubRepoInfo.id },
			data: { workspaceId },
		});
	}

	return true;
}
