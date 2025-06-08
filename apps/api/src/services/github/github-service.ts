import {
	type DBClient,
	type GithubOrg,
	type GithubRepo,
	and,
	eq,
	githubCommitsTable,
	githubOrgTable,
	githubPullRequestTaskTable,
	githubPullRequestsTable,
	githubRepoTable,
	inArray,
	tasksTable,
	workspacesTable,
} from "@squaredmade/db";
import type { Logger } from "@squaredmade/logger";
import createCustomLogger from "@squaredmade/logger";
import type { GithubRpc, UpsertPullRequestResponse } from "./types";

export class GithubService implements GithubRpc {
	private readonly db: DBClient;
	private readonly logger: Logger;
	constructor(db: DBClient) {
		this.db = db;
		this.logger = createCustomLogger("github");
	}

	async getWorkspaceOrganizations({ workspaceId }: { workspaceId: string }) {
		this.logger.info("Fetching workspace repositories with id: ", workspaceId);
		return await this.db
			.select({
				name: githubOrgTable.name,
				createdAt: githubOrgTable.createdAt,
			})
			.from(githubOrgTable)
			.where(eq(githubOrgTable.workspaceId, workspaceId))
			.then((repos) =>
				repos.map((repo) => ({ name: repo.name, createdAt: repo.createdAt })),
			);
	}
	async upsertPullRequest({
		id,
		number,
		state,
		title,
		url,
		branch,
		body,
		author,
		timestamp,
		repo,
		org,
	}: {
		id: string;
		number: number;
		state: "open" | "closed";
		title: string;
		url: string;
		branch: string;
		body: string;
		author: string;
		timestamp: string;
		repo: Omit<GithubRepo, "externalId">;
		org: Omit<GithubOrg, "externalId" | "workspaceId" | "createdAt">;
	}): Promise<UpsertPullRequestResponse> {
		this.logger.info(
			`Upserting pull request with id: ${id} and number: ${number}`,
		);

		const taskIdMatches = [
			...title.matchAll(/\[(.*?)\]/g),
			...(body?.matchAll(/\[(.*?)\]/g) ?? []),
		].map((match) => match[1]);

		const tasks = await this.db.transaction(async (tx) => {
			const tasks = await tx
				.select({
					id: tasksTable.id,
					identifier: tasksTable.identifier,
					workspaceUrl: workspacesTable.url,
					title: tasksTable.title,
					workspaceId: tasksTable.workspaceId,
				})
				.from(tasksTable)
				.leftJoin(
					workspacesTable,
					eq(tasksTable.workspaceId, workspacesTable.externalId),
				)
				.where(inArray(tasksTable.identifier, taskIdMatches));

			if (tasks.length === 0) {
				this.logger.warn(
					`No tasks found for pull request with id: ${id} and number: ${number}`,
				);
				return { tasks: [] };
			}

			const { id: repoExternalId, ...repoRest } = repo;
			const { id: orgExternalId, ...orgRest } = org;

			this.logger.debug("Tasks found for pull request: ", tasks);

			await tx
				.insert(githubOrgTable)
				.values({
					...orgRest,
					externalId: orgExternalId,
					workspaceId: tasks[0].workspaceId,
				})
				.onConflictDoNothing();
			await tx
				.insert(githubRepoTable)
				.values({ ...repoRest, externalId: repoExternalId })
				.onConflictDoUpdate({
					target: githubRepoTable.externalId,
					set: { ...repoRest },
				});

			const [pull] = await tx
				.insert(githubPullRequestsTable)
				.values({
					externalId: id,
					number,
					state,
					title,
					url,
					branch,
					body,
					author,
					githubRepoInfoId: repo.id,
					timestamp: new Date(timestamp),
				})
				.onConflictDoUpdate({
					target: githubPullRequestsTable.externalId,
					set: { state, title, body },
				})
				.returning();

			const newTasks = await Promise.all(
				tasks.flatMap((task) =>
					tx
						.insert(githubPullRequestTaskTable)
						.values({ taskId: task.id, pullRequestId: pull.externalId })
						.onConflictDoNothing()
						.returning(),
				),
			).then((results) => results.flat().map((row) => row.taskId));

			return {
				tasks: tasks
					.filter(({ id }) => newTasks.includes(id))
					.map((task) => ({
						identifier: task.identifier,
						url: `/${task.workspaceUrl}/task/${task.identifier}/${this.formatUrl(task.title)}`,
						title: task.title,
					})),
			};
		});

		return tasks;
	}

	async mergePullRequest({ pullRequestId }: { pullRequestId: string }) {
		this.logger.info(`Merging pull request with id: ${pullRequestId}`);

		return await this.db.transaction(async (tx) => {
			// 1. Update the pull request state to "closed"
			await tx
				.update(githubPullRequestsTable)
				.set({ state: "closed" })
				.where(eq(githubPullRequestsTable.externalId, pullRequestId));

			// 2. Find all tasks associated with this pull request
			const tasksWithPullRequest = await tx
				.select({
					taskId: githubPullRequestTaskTable.taskId,
				})
				.from(githubPullRequestTaskTable)
				.where(eq(githubPullRequestTaskTable.pullRequestId, pullRequestId));

			const taskIds = tasksWithPullRequest.map((task) => task.taskId);

			if (taskIds.length === 0) {
				this.logger.warn(
					`No tasks found for pull request with id: ${pullRequestId}`,
				);
				return;
			}

			// 3. Get tasks that are in "inReview" status
			const tasksInReview = await tx
				.select({
					id: tasksTable.id,
				})
				.from(tasksTable)
				.where(
					and(
						inArray(tasksTable.id, taskIds),
						eq(tasksTable.status, "inReview"),
					),
				);

			if (tasksInReview.length === 0) {
				this.logger.info(
					`No tasks in review found for pull request with id: ${pullRequestId}`,
				);
				return;
			}

			// 4. For each task in review, check if all its associated PRs are closed
			const tasksToUpdate: string[] = [];

			for (const task of tasksInReview) {
				const associatedPRs = await tx
					.select({
						pullRequestId: githubPullRequestTaskTable.pullRequestId,
						state: githubPullRequestsTable.state,
					})
					.from(githubPullRequestTaskTable)
					.innerJoin(
						githubPullRequestsTable,
						eq(
							githubPullRequestTaskTable.pullRequestId,
							githubPullRequestsTable.externalId,
						),
					)
					.where(eq(githubPullRequestTaskTable.taskId, task.id));

				// Check if all PRs are closed
				const allPRsClosed = associatedPRs.every((pr) => pr.state === "closed");

				if (allPRsClosed) {
					tasksToUpdate.push(task.id);
				}
			}

			// 5. Update the tasks to "done" status
			if (tasksToUpdate.length > 0) {
				await tx
					.update(tasksTable)
					.set({ status: "done" })
					.where(inArray(tasksTable.id, tasksToUpdate));

				this.logger.info(
					`Updated ${tasksToUpdate.length} tasks to done status`,
				);
			}
		});
	}

	async closePullRequest({ pullRequestId }: { pullRequestId: string }) {
		this.logger.info(`Closing pull request with id: ${pullRequestId}`);
		return await this.db.transaction(async (tx) => {
			await tx
				.update(githubPullRequestsTable)
				.set({ state: "closed" })
				.where(eq(githubPullRequestsTable.externalId, pullRequestId));
		});
	}

	async pushCommit({
		id,
		message,
		url,
		author,
		repoId,
		branch,
		timestamp,
	}: {
		id: string;
		message: string;
		url: string;
		author: string;
		repoId: string;
		branch: string;
		timestamp: string;
	}) {
		this.logger.info(`Pushing commit with id: ${id}`);
		return await this.db.transaction(async (tx) => {
			const [pull] = await tx
				.select({ externalId: githubPullRequestsTable.externalId })
				.from(githubPullRequestsTable)
				.where(eq(githubPullRequestsTable.branch, branch))
				.limit(1);
			if (!pull) return;

			await tx.insert(githubCommitsTable).values({
				externalId: id,
				message,
				url,
				author,
				repoId,
				pullId: pull.externalId,
				timestamp: new Date(timestamp),
			});
		});
	}

	async uploadOrg({
		id,
		name,
		description,
		workspaceId,
	}: {
		id: string;
		name: string;
		description: string;
		workspaceId: string;
	}): Promise<{ slug: string }> {
		this.logger.info(`Uploading organization with id: ${id}`);
		return await this.db.transaction(async (tx) => {
			await tx
				.insert(githubOrgTable)
				.values({
					externalId: id,
					name,
					description,
					workspaceId,
				})
				.onConflictDoNothing();
			return await tx
				.select({ slug: workspacesTable.url })
				.from(workspacesTable)
				.where(eq(workspacesTable.externalId, workspaceId))
				.then(([workspace]) => ({ slug: workspace.slug }));
		});
	}

	private formatUrl(title: string) {
		const titleSlug = title
			.toLowerCase()
			.replace(/'/g, "")
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/(^-|-$)/g, "");
		return titleSlug;
	}
}
