import {
	type DBClient,
	eq,
	githubCommitsTable,
	githubPullRequestTaskTable,
	githubPullRequestsTable,
	githubRepoTable,
	inArray,
	tasksTable,
	usersTable,
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

	async getUserRepositories({ userId }: { userId: string }) {
		this.logger.info("Fetching user repositories with id: ", userId);
		return await this.db.transaction(async (tx) => {
			const user = await tx
				.select({ githubUsername: usersTable.githubUsername })
				.from(usersTable)
				.where(eq(usersTable.externalId, userId))
				.limit(1)
				.then((results) => results[0]);

			if (!user?.githubUsername) {
				throw new Error("GitHub username not found");
			}

			const connectedRepos = await tx
				.select({ repoName: githubRepoTable.repoName })
				.from(githubRepoTable)
				.where(eq(githubRepoTable.owner, user.githubUsername));

			return connectedRepos.map((repo) => repo.repoName);
		});
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
		repoId,
		timestamp,
	}: {
		id: string;
		number: number;
		state: "open" | "closed";
		title: string;
		url: string;
		branch: string;
		body: string;
		author: string;
		repoId: string;
		timestamp: string;
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
			repoId,
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
					githubRepoInfoId: repoId,
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
