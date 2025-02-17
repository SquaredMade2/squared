import {
	type DBClient,
	type GithubOrg,
	type GithubRepo,
	eq,
	githubCommitsTable,
	githubOrgTable,
	githubPullRequestTaskTable,
	githubPullRequestsTable,
	githubRepoTable,
	inArray,
	tasksTable,
	workspacesTable,
} from "@squared/db";
import type { Logger } from "@squared/logger";
import createCustomLogger from "@squared/logger";
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

			await Promise.all([
				tx
					.insert(githubRepoTable)
					.values({ ...repoRest, externalId: repoExternalId })
					.onConflictDoUpdate({
						target: githubRepoTable.externalId,
						set: { ...repoRest },
					}),
				tx
					.insert(githubOrgTable)
					.values({
						...orgRest,
						externalId: orgExternalId,
						workspaceId: tasks[0].workspaceId,
					})
					.onConflictDoNothing(),
			]);

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
	}) {
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
