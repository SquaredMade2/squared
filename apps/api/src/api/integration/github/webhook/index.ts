import type { Route } from "@/api/route";
import {
	type DBClient,
	and,
	branchesTable,
	commitsTable,
	eq,
	githubRepoInfoTable,
	inArray,
	tasksTable,
	workspaceRepositoriesTable,
	workspacesTable,
} from "@squared/db";
import createCustomLogger from "@squared/logger";

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

const logger = createCustomLogger("integrations");

export function createRoute({ db }: { db: DBClient }): Route<Params> {
	return {
		POST: async (res, _, body): Promise<void> => {
			logger.info("Received GitHub webhook");
			const payload: GitHubWebhookPayload = body;
			const eventType = res.req.headers["x-github-event"];

			try {
				if (eventType === "installation_repositories") {
					await handleRepositoryChanges(payload, db);
					res
						.status(200)
						.json({ message: "Repositories processed successfully" });
					return;
				}

				if (eventType === "create" || eventType === "push") {
					await handleBranchAndCommitEvents(payload, eventType, db);
					res.status(200).json({ message: "Webhook processed successfully" });
					return;
				}

				res.status(204).json({ message: "No relevant event type" });
			} catch (error) {
				logger.error("Error handling webhook: %0", error);
				res.status(500).json({
					message: `Error during webhook: ${error instanceof Error && `: ${error.message}`}`,
				});
			}
		},
	};
}

// Handle repository addition and removal
async function handleRepositoryChanges(
	payload: GitHubWebhookPayload,
	db: DBClient,
) {
	const repositoriesAdded = payload.repositories_added || [];
	const repositoriesRemoved = payload.repositories_removed || [];
	const githubUsername = payload.installation?.account?.login;

	if (!githubUsername) {
		throw new Error("GitHub username is missing from the payload");
	}

	// Handle repository removal
	for (const repo of repositoriesRemoved) {
		if (!repo.full_name || !githubUsername) {
			logger.error(
				"Missing repository data for removal: %s %s",
				repo.full_name ?? "Repository name",
				githubUsername ?? "Repository owner",
			);
			continue;
		}

		await db.delete(workspaceRepositoriesTable).where(
			inArray(
				workspaceRepositoriesTable.repoId,
				db
					.select({ id: githubRepoInfoTable.id })
					.from(githubRepoInfoTable)
					.where(
						and(
							eq(githubRepoInfoTable.repoName, repo.full_name),
							eq(githubRepoInfoTable.owner, githubUsername),
						),
					),
			),
		);

		// check if the repo still exists and delete it only if there are no remaining links
		const remainingLinks = await db.$count(
			workspaceRepositoriesTable,
			and(
				eq(githubRepoInfoTable.repoName, repo.full_name),
				eq(githubRepoInfoTable.owner, githubUsername),
			),
		);

		// fetch the repository info to ensure it exists before attempting to delete
		const [githubRepoInfo] = await db
			.select()
			.from(githubRepoInfoTable)
			.where(
				and(
					eq(githubRepoInfoTable.repoName, repo.full_name),
					eq(githubRepoInfoTable.owner, githubUsername),
				),
			);

		if (remainingLinks === 0 && githubRepoInfo) {
			await db
				.delete(githubRepoInfoTable)
				.where(eq(githubRepoInfoTable.id, githubRepoInfo.id));
		} else {
			logger.error(
				"Repository %s still linked to other workspaces or does not exist.",
				repo.full_name,
			);
		}
	}

	// Handle repository addition
	for (const repo of repositoriesAdded) {
		if (!repo.full_name || !githubUsername) {
			logger.error(
				"Missing repository data for removal: %s %s",
				repo.full_name ?? "Repository name",
				githubUsername ?? "Repository owner",
			);
			continue;
		}

		await db
			.insert(githubRepoInfoTable)
			.values({
				repoName: repo.full_name,
				owner: githubUsername,
			})
			.onConflictDoNothing()
			.returning()
			.execute();
	}
}

// Handle branch creation and push events
async function handleBranchAndCommitEvents(
	payload: GitHubWebhookPayload,
	eventType: string,
	db: DBClient,
) {
	const branchName = payload.ref?.split("/").pop();
	const repoFullName = payload.repository?.full_name || "";
	const repoOwner = payload.repository?.owner?.login || "";
	const identifierPattern = /([A-Z]{2,}-\d+)/i;
	const match = branchName?.match(identifierPattern);

	if (!match || !branchName) {
		throw new Error("No task identifier found in branch name");
	}

	const identifier = match[1].toUpperCase();
	const [task] = await db
		.select()
		.from(tasksTable)
		.innerJoin(workspacesTable, eq(workspacesTable.id, tasksTable.workspaceId))
		.where(eq(tasksTable.identifier, identifier))
		.limit(1);

	if (!task || !task.Task.workspaceId) {
		throw new Error(`Task ${identifier} not found or has no workspace`);
	}

	const [githubRepoInfo] = await db
		.select()
		.from(githubRepoInfoTable)
		.where(
			and(
				eq(githubRepoInfoTable.repoName, repoFullName),
				eq(githubRepoInfoTable.owner, repoOwner),
			),
		)
		.limit(1);

	if (!githubRepoInfo) {
		throw new Error("No GithubRepoInfo found for this repository");
	}

	// Link the repository to the workspace if not already linked
	await db
		.insert(workspaceRepositoriesTable)
		.values({
			workspaceId: task.Task.workspaceId,
			repoId: githubRepoInfo.id,
		})
		.onConflictDoNothing();

	const [existingBranch] = await db
		.select()
		.from(branchesTable)
		.where(
			and(
				eq(branchesTable.name, branchName),
				eq(branchesTable.taskId, task.Task.id),
			),
		)
		.limit(1);

	let branch = existingBranch;

	if (!branch) {
		branch = await db
			.insert(branchesTable)
			.values({
				name: branchName || "",
				taskId: task.Task.id,
				githubRepoInfoId: githubRepoInfo.id,
			})
			.returning()
			.then((results) => results[0]);
	}

	// Handle commits if it's a push event
	if (eventType === "push" && payload.commits) {
		for (const commit of payload.commits) {
			await db
				.insert(commitsTable)
				.values({
					id: commit.id,
					message: commit.message,
					timestamp: new Date(commit.timestamp),
					url: commit.url,
					authorName: payload.pusher?.name,
					branchId: branch.id,
					repoName: repoFullName,
					owner: repoOwner,
					taskId: task.Task.id,
				})
				.onConflictDoUpdate({
					target: commitsTable.id,
					set: {
						message: commit.message,
						timestamp: new Date(commit.timestamp),
						url: commit.url,
						authorName: payload.pusher?.name,
					},
				});
		}
	}
}
