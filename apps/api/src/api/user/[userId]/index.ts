import { prisma } from "@/api";
import type { APIResponse, Route } from "@/api/route";
import type { User } from "@squared/db";
import createCustomLogger from "@squared/logger";

type Params = {
	userId: string;
};

const logger = createCustomLogger("user");

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { userId }): Promise<APIResponse<User>> => {
			try {
				logger.info("Finding user by ID: %s", userId);
				const user: User | null = await prisma.user.findUnique({
					where: { id: userId },
				});

				if (!user) {
					return {
						data: null,
						message: "User not found",
						variant: "destructive",
					};
				}

				return {
					data: user,
					variant: "default",
				};
			} catch (err) {
				logger.error("Error finding user: %0", err);
				res.status(500);
				return {
					data: null,
					message: "Internal Server Error",
					variant: "destructive",
				};
			}
		},
		PUT: async (res, { userId }, body): Promise<APIResponse<User>> => {
			try {
				logger.info("Updating user by ID: %s", userId);
				const user: User | null = await prisma.user.update({
					where: { id: userId },
					data: body,
				});

				if (!user) {
					return {
						data: null,
						message: "User not found",
						variant: "destructive",
					};
				}
				return {
					data: user,
					variant: "default",
				};
			} catch (err) {
				logger.error("Error updating user: %0", err);
				res.status(500);
				return {
					data: null,
					message: "Internal Server Error",
					variant: "destructive",
				};
			}
		},
		POST: async (res, { userId }, body): Promise<APIResponse<User>> => {
			try {
				logger.info("Creating new user by ID: %s", userId);
				const ifUserExists: User | null = await prisma.user.findUnique({
					where: { id: userId },
				});
				if (ifUserExists) {
					return {
						data: null,
						message: "User already exists",
						variant: "destructive",
					};
				}

				const newUser = await prisma.user.create({
					data: {
						id: userId,
						defaultWorkspaceId: null,
						...body,
					} as User,
				});

				if (!newUser) {
					res.status(500);
					return {
						data: null,
						message: "failed to created new user",
						variant: "destructive",
					};
				}

				return {
					data: newUser,
					variant: "default",
				};
			} catch (err) {
				logger.error("Error while creating new user: %0", err);
				res.status(500);
				return {
					data: null,
					message: "failed to created new user",
					variant: "destructive",
				};
			}
		},
		DELETE: async (res, { userId }): Promise<APIResponse<User>> => {
			try {
				logger.info("Deleting user by ID: %s", userId);
				const user = await prisma.user.delete({
					where: { id: userId },
				});

				if (!user) {
					res.status(404);
					return {
						data: null,
						message: "User not found",
						variant: "destructive",
					};
				}

				return {
					data: null,
					message: "User deleted",
					variant: "default",
				};
			} catch (err) {
				logger.error("Error while creating new user: %0", err);
				res.status(500);
				return {
					data: null,
					message: "Failed to delete User",
					variant: "destructive",
				};
			}
		},
	};
}
