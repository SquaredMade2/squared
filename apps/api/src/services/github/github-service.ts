import {
	type DBClient,
	type GithubRepo,
	eq,
	githubCommitsTable,
	githubPullRequestTaskTable,
	githubPullRequestsTable,
	githubRepoTable,
	inArray,
	tasksTable,
	workspaceRepositoriesTable,
	workspacesTable,
} from "@squared/db";
import type { Logger } from "@squared/logger";
import createCustomLogger from "@squared/logger";
import type { GithubRpc } from "./types";

export class GithubService implements GithubRpc {
	private readonly db: DBClient;
	private readonly logger: Logger;
	constructor(db: DBClient) {
		this.db = db;
		this.logger = createCustomLogger("github");
	}

	async getWorkspaceRepositories({ workspaceId }: { workspaceId: string }) {
		this.logger.info("Fetching workspace repositories with id: ", workspaceId);
		return await this.db
			.select({
				name: githubRepoTable.name,
			})
			.from(workspacesTable)
			.innerJoin(
				workspaceRepositoriesTable,
				eq(workspacesTable.externalId, workspaceRepositoriesTable.workspaceId),
			)
			.innerJoin(
				githubRepoTable,
				eq(workspaceRepositoriesTable.repoId, githubRepoTable.id),
			)
			.where(eq(workspacesTable.externalId, workspaceId))
			.then((repos) => repos.map((repo) => repo.name));
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
	}) {
		this.logger.info(
			`Upserting pull request with id: ${id} and number: ${number}`,
		);

		console.log("Args: ", {
			id,
			number,
			state,
			title,
			url,
			branch,
			body,
			author,
			repo,
			timestamp,
		});

		const taskIdMatches = [
			...title.matchAll(/\[(.*?)\]/g),
			...(body?.matchAll(/\[(.*?)\]/g) ?? []),
		].map((match) => match[1]);

		return await this.db.transaction(async (tx) => {
			const tasks = await tx
				.select({ id: tasksTable.id })
				.from(tasksTable)
				.where(inArray(tasksTable.identifier, taskIdMatches));

			if (tasks.length === 0) {
				this.logger.warn(
					`No tasks found for pull request with id: ${id} and number: ${number}`,
				);
				return;
			}

			const { id: externalId, ...rest } = repo;
			await tx
				.insert(githubRepoTable)
				.values({ ...rest, externalId })
				.onConflictDoUpdate({
					target: githubRepoTable.externalId,
					set: { ...rest },
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
					set: { number, state, title, url, branch, body, author },
				})
				.returning();

			await Promise.all(
				tasks.map((task) =>
					tx
						.insert(githubPullRequestTaskTable)
						.values({ taskId: task.id, pullRequestId: pull.externalId }),
				),
			);
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
}
