import { createRpcHandler, createServiceSchema } from "@squared/rpc";
import z from "zod";
import { userSchema } from "../schema";
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
});

export type UserRpcSchema = typeof userRpcSchema;

export const createUserRpcHandler = (userService: UserService) =>
	createRpcHandler("user", userRpcSchema, {
		onBoardUser: (input) => userService.onBoardUser(input),
		updateUser: (input) => userService.updateUser(input),
		updateUserNotifications: (input) =>
			userService.updateUserNotifications(input),
		getUser: (input) => userService.getUser(input),
		getWorkspaceUsers: (input) => userService.getWorkspaceUsers(input),
		getUserAvatars: (input) => userService.getUserAvatars(input),
		getUserRepositories: (input) => userService.getUserRepositories(input),
	});
