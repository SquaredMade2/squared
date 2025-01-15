import { createRpcHandler, createServiceSchema } from "@squared/rpc";
import z from "zod";
import { teamSchema, userSchema, userWithRoleSchema } from "../schema";
import type { UserRpc } from "./types";
import type { UserService } from "./user-service";

export const userRpcSchema = createServiceSchema<UserRpc>()({
	onBoardUser: {
		input: z.object({
			userId: z.string(),
		}),
		output: userSchema,
	},
	updateUser: {
		input: z.object({
			userId: z.string(),
			name: z.string(),
			username: z.string().optional(),
		}),
		output: userSchema,
	},
	updateUserAvatar: {
		input: z.object({
			userId: z.string(),
			avatarUrl: z.string(),
		}),
		output: userSchema,
	},
	updateUserNotifications: {
		input: z.object({
			userId: z.string(),
			notificationIds: z.array(z.string()),
		}),
		output: userSchema,
	},
	getUser: {
		input: z.object({
			userId: z.string(),
		}),
		output: userSchema.nullable(),
	},
	getWorkspaceUsers: {
		input: z.object({
			workspaceId: z.string(),
		}),
		output: z.array(userSchema),
	},
	getTeamUsers: {
		input: z.object({
			teamId: z.string(),
		}),
		output: z.array(userSchema),
	},
	getUserAvatars: {
		input: z.object({
			workspaceId: z.string(),
		}),
		output: z.array(
			z.object({
				id: z.string(),
				name: z.string(),
				avatarUrl: z.string().nullable(),
			}),
		),
	},
	getUserRepositories: {
		input: z.object({
			userId: z.string(),
		}),
		output: z.array(z.string()),
	},
	getUserTeams: {
		input: z.object({
			userId: z.string(),
		}),
		output: z.array(teamSchema),
	},
	setLastViewedTask: {
		input: z.object({
			userId: z.string(),
			taskId: z.string(),
		}),
		output: userSchema,
	},
	getUserWorkspaceRole: {
		input: z.object({
			userId: z.string(),
			workspaceId: z.string(),
		}),
		output: z.enum(["owner", "admin", "member"]),
	},
	getWorkspaceUsersWithRoles: {
		input: z.object({
			workspaceId: z.string(),
		}),
		output: z.array(userWithRoleSchema),
	},
	updateUsersRole: {
		input: z.object({
			userId: z.string(),
			workspaceId: z.string(),
			newRole: z.enum(["owner", "admin", "member"]),
		}),
		output: z.object({
			userId: z.string(),
			workspaceId: z.string(),
			role: z.enum(["owner", "admin", "member"]),
		}),
	},
});

export type UserRpcSchema = typeof userRpcSchema;

export const createUserRpcHandler = (userService: UserService) =>
	createRpcHandler("user", userRpcSchema, {
		onBoardUser: (input) => userService.onBoardUser(input),
		updateUser: (input) => userService.updateUser(input),
		updateUserAvatar: (input) => userService.updateUserAvatar(input),
		updateUserNotifications: (input) =>
			userService.updateUserNotifications(input),
		getUser: (input) => userService.getUser(input),
		getWorkspaceUsers: (input) => userService.getWorkspaceUsers(input),
		getTeamUsers: (input) => userService.getTeamUsers(input),
		getUserAvatars: (input) => userService.getUserAvatars(input),
		getUserRepositories: (input) => userService.getUserRepositories(input),
		getUserTeams: (input) => userService.getUserTeams(input),
		setLastViewedTask: (input) => userService.setLastViewedTask(input),
		getUserWorkspaceRole: (input) => userService.getUserWorkspaceRole(input),
		getWorkspaceUsersWithRoles: (input) =>
			userService.getWorkspaceUsersWithRoles(input),
		updateUsersRole: (input) => userService.updateUsersRole(input),
	});
