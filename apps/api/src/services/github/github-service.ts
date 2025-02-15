import {
	type DBClient,
	eq,
	githubPullRequestTaskTable,
	githubPullRequestsTable,
	githubRepoInfoTable,
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
				.select({ repoName: githubRepoInfoTable.repoName })
				.from(githubRepoInfoTable)
				.where(eq(githubRepoInfoTable.owner, user.githubUsername));

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
	}) {
		this.logger.info(
			`Upserting pull request with id: ${id} and number: ${number}`,
		);

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
}
