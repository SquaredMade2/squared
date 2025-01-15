import type { Team, User } from "@squared/db";

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
	getUserRepositories: (args: { userId: string }) => Promise<string[]>;
	getUserTeams: (args: { userId: string }) => Promise<Team[]>;
	setLastViewedTask: (args: {
		userId: string;
		taskId: string;
	}) => Promise<User>;
	getUserWorkspaceRole: (args: {
		userId: string;
		workspaceId: string;
	}) => Promise<"member" | "admin" | "owner">;
	getWorkspaceUsersWithRoles: (args: { workspaceId: string }) => Promise<
		(User & { role: "member" | "admin" | "owner" })[]
	>;
	updateUsersRole: (args: {
		userId: string;
		workspaceId: string;
		newRole: "owner" | "admin" | "member";
	}) => Promise<{
		userId: string;
		workspaceId: string;
		role: "owner" | "admin" | "member";
	}>;
}
