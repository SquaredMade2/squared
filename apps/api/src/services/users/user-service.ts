import type { PrismaClient, Team } from "@squared/db";
import type { Logger } from "@squared/logger";
import createCustomLogger from "@squared/logger";
import type { UserRpc } from "./types";

export class UserService implements UserRpc {
	private readonly db: PrismaClient;
	private readonly logger: Logger;
	constructor(db: PrismaClient) {
		this.db = db;
		this.logger = createCustomLogger("users");
	}

	async onBoardUser({ userId }: { userId: string }) {
		this.logger.info("Onboarding user with id: %s", userId);
		return await this.db.user.update({
			where: { id: userId },
			data: { onBoarding: false },
		});
	}

	async updateUser({
		userId,
		...args
	}: { userId: string; name: string; username?: string }) {
		this.logger.info("Updating user with id: %s", userId);
		return await this.db.user.update({
			where: { id: userId },
			data: args,
		});
	}

	async updateUserAvatar({
		userId,
		avatarUrl,
	}: { userId: string; avatarUrl: string }) {
		this.logger.info(
			"Updating user avatar with\n\tuserId:  %s\n\turl:     %s",
			userId,
			avatarUrl,
		);
		return await this.db.user.update({
			where: { id: userId },
			data: { avatarUrl },
		});
	}

	async updateUserNotifications({
		userId,
		notificationIds: savedNotificationIds,
	}: {
		userId: string;
		notificationIds: string[];
	}) {
		this.logger.info("Updating user notifications with id: %s", userId);
		return await this.db.user.update({
			where: { id: userId },
			data: {
				savedNotificationIds,
			},
		});
	}

	async getUser({ userId }: { userId: string }) {
		this.logger.info("Fetching user with id: %s", userId);
		return await this.db.user.findUnique({
			where: { id: userId },
		});
	}

	async getWorkspaceUsers({ workspaceId }: { workspaceId: string }) {
		this.logger.info("Fetching workspace users with id: %s", workspaceId);
		return await this.db.userWorkspace
			.findMany({
				where: { workspaceId },
				include: {
					user: true,
				},
			})
			.then((uw) => uw.map((u) => u.user));
	}

	async getTeamUsers({ teamId }: { teamId: string }) {
		this.logger.info("Fetching team users with id: %s", teamId);
		return await this.db.userTeam
			.findMany({
				where: { teamId },
				include: {
					user: true,
				},
			})
			.then((ut) => ut.map((u) => u.user));
	}

	async getUserAvatars({ workspaceId }: { workspaceId: string }) {
		this.logger.info("Fetching user avatars with id: %s", workspaceId);
		return await this.db.userWorkspace
			.findMany({
				where: { workspaceId },
				include: {
					user: {
						select: {
							id: true,
							name: true,
							avatarUrl: true,
						},
					},
				},
			})
			.then((uw) => uw.map((u) => u.user));
	}

	async getUserRepositories({ userId }: { userId: string }) {
		this.logger.info("Fetching user repositories with id: %s", userId);
		const user = await this.db.user.findUnique({
			where: { id: userId },
			select: { githubUsername: true },
		});

		if (!user?.githubUsername) {
			throw new Error("GitHub username not found");
		}

		const connectedRepos = await this.db.githubRepoInfo.findMany({
			where: { owner: user.githubUsername },
			select: { repoName: true },
		});

		return connectedRepos.map((repo) => repo.repoName);
	}
	async getUserTeams({ userId }: { userId: string }): Promise<Team[]> {
		this.logger.info("Fetching user teams with id: %s", userId);
		return await this.db.userTeam
			.findMany({
				where: { userId },
				include: {
					team: true,
				},
			})
			.then((userTeams) => userTeams.map((ut) => ut.team));
	}
}
