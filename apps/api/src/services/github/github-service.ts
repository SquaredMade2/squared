import {
	type DBClient,
	eq,
	githubRepoInfoTable,
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
}
