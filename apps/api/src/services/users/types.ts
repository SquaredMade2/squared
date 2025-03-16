import type { Team, User, Workspace } from "@squared/db";

export type UserAvatar = {
	id: string;
	name: string;
	avatarUrl: string | null;
};

export interface UserRpc {
	onBoardUser: (args: { userId: string }) => Promise<User>;
	updateUser: (args: {
		userId: string;
		name: string;
		username?: string;
	}) => Promise<User>;
	updateUserAvatar: (args: {
		userId: string;
		avatarUrl: string;
	}) => Promise<User>;
	updateUserNotifications: (args: {
		userId: string;
		notificationIds: string[];
	}) => Promise<User>;
	getUser: (args: { userId: string }) => Promise<User | null>;
	getWorkspaceUsers: (args: { workspaceId: string }) => Promise<User[]>;
	getTeamUsers: (args: { teamId: string }) => Promise<User[]>;
	getUserAvatars: (args: { workspaceId: string }) => Promise<UserAvatar[]>;
	getUserTeams: (args: { userId: string }) => Promise<Team[]>;
	setLastViewedTask: (args: {
		userId: string;
		taskId: string;
	}) => Promise<User>;
	getDefaultWorkspace: (args: {
		userId: string;
	}) => Promise<Workspace | null>;
	isUserAuthorized: (args: {
		userId: string;
		teamIdentifier: string;
	}) => Promise<boolean>;
	deleteUser: (args: { userId: string }) => Promise<void>;
}

export type DeletedUser = {
	id: string;
	name: string | null;
	avatarUrl?: string;
	deletedAt: Date;
};
