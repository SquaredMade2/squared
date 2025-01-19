import type { PrismaClient, Team, Workspace, WorkspaceRole } from "@squared/db";
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
			where: { externalId: userId },
			data: { onBoarding: false },
		});
	}

	async updateUser({
		userId,
		...args
	}: { userId: string; name: string; username?: string }) {
		this.logger.info("Updating user with id: %s", userId);
		return await this.db.user.update({
			where: { externalId: userId },
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
			where: { externalId: userId },
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
			where: { externalId: userId },
			data: {
				savedNotificationIds,
			},
		});
	}

	async getUser({ userId }: { userId: string }) {
		this.logger.info("Fetching user with id: %s", userId);
		return await this.db.user.findUnique({
			where: { externalId: userId },
		});
	}

	async getUserWorkspaceRole({
		userId,
		workspaceId,
	}: {
		userId: string;
		workspaceId: string;
	}) {
		this.logger.info(
			"Fetching user role for userId: %s in workspaceId: %s",
			userId,
			workspaceId,
		);
		const userWorkspace = await this.db.userWorkspace.findUnique({
			where: {
				userId_workspaceId: {
					userId: userId,
					workspaceId: workspaceId,
				},
			},
			select: {
				role: true,
			},
		});

		if (!userWorkspace) {
			return "member" as const;
		}
		return userWorkspace.role;
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

	async getWorkspaceUsersWithRoles({ workspaceId }: { workspaceId: string }) {
		this.logger.info("Fetching workspace users with id: %s", workspaceId);
		return await this.db.userWorkspace
			.findMany({
				where: { workspaceId },
				select: {
					user: true,
					role: true,
				},
			})
			.then((uw) =>
				uw.map((u) => ({
					...u.user,
					role: u.role,
				})),
			);
	}

	async updateUsersRole({
		callerId,
		userId,
		workspaceId,
		newRole,
	}: {
		callerId: string;
		userId: string;
		workspaceId: string;
		newRole: WorkspaceRole;
	}) {
		//Get both users current roles
		const [callerRole, targetRole] = await Promise.all([
			this.db.userWorkspace.findUnique({
				where: {
					userId_workspaceId: {
						userId: callerId,
						workspaceId,
					},
				},
				select: { role: true },
			}),
			this.db.userWorkspace.findUnique({
				where: {
					userId_workspaceId: {
						userId,
						workspaceId,
					},
				},
				select: { role: true },
			}),
		]);

		if (!callerRole || !targetRole) {
			throw new Error("One of the users was not found in workspace");
		}

		if (callerRole.role === "member") {
			throw new Error("Members cannot modify roles");
		}

		if (
			callerRole.role === "admin" &&
			(targetRole.role === "owner" || targetRole.role === "admin")
		) {
			throw new Error("Admins cannot modify owner or other admin roles");
		}

		this.logger.info(
			"User with id: %s is updating role for userId: %s to %s in workspace: %s",
			callerId,
			userId,
			newRole,
			workspaceId,
		);

		// Start a transaction to ensure both updates happen or neither happens
		return await this.db.$transaction(async (tx) => {
			//Making sure there can only ever be one owner
			if (newRole === "owner") {
				await tx.userWorkspace.updateMany({
					where: {
						workspaceId,
						role: "owner",
					},
					data: {
						role: "admin",
					},
				});
			}
			return await tx.userWorkspace.update({
				where: {
					userId_workspaceId: {
						userId,
						workspaceId,
					},
				},
				data: {
					role: newRole,
				},
			});
		});
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
							externalId: true,
							name: true,
							avatarUrl: true,
						},
					},
				},
			})
			.then((uw) =>
				uw.map((u) => {
					const { externalId, name, avatarUrl } = u.user;
					return { id: externalId, name, avatarUrl };
				}),
			);
	}

	async getUserRepositories({ userId }: { userId: string }) {
		this.logger.info("Fetching user repositories with id: %s", userId);
		const user = await this.db.user.findUnique({
			where: { externalId: userId },
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

	async setLastViewedTask({
		userId,
		taskId,
	}: {
		userId: string;
		taskId: string;
	}) {
		this.logger.info(
			"Setting last viewed task for userId: %s, taskId: %s",
			userId,
			taskId,
		);
		try {
			return await this.db.user.update({
				where: { externalId: userId },
				data: { lastViewedTaskId: taskId },
				include: { lastViewedTask: true },
			});
		} catch (error) {
			if (error instanceof Error) {
				this.logger.error(
					"Failed to set last viewed task for userId: %s, taskId: %s. Error: %s",
					userId,
					taskId,
					error.message,
				);
			} else {
				this.logger.error(
					"Failed to set last viewed task for userId: %s, taskId: %s. Unknown error occurred.",
					userId,
					taskId,
				);
			}
			throw error;
		}
	}

	async getDefaultWorkspace({
		userId,
	}: { userId: string }): Promise<Workspace | null> {
		this.logger.info("Fetching default workspace for userId: %s", userId);
		const user = await this.db.user.findUnique({
			where: { externalId: userId },
			include: {
				Workspaces: {
					include: {
						workspace: true,
					},
				},
			},
		});
		if (!user) {
			throw new Error("User not found");
		}

		if (user.Workspaces.length === 0) {
			return null;
		}

		const defaultWorkspace = user.Workspaces.find(
			(w) => w.workspaceId === user.defaultWorkspaceId,
		)?.workspace;

		return defaultWorkspace || user.Workspaces[0].workspace;
	}

	async isUserAuthorized({
		userId,
		teamIdentifier,
	}: {
		userId: string;
		teamIdentifier: string;
	}): Promise<boolean> {
		this.logger.info(
			"Checking if user with id: %s is authorized for team with identifier: %s",
			userId,
			teamIdentifier,
		);
		const userTeam = await this.db.userTeam.findFirst({
			where: {
				userId,
				team: {
					identifier: teamIdentifier,
				},
			},
		});

		return !!userTeam;
	}
}
