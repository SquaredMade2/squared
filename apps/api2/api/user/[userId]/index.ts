import type { User } from "@repo/db";
import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";

type Params = {
	userId: string;
};

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { userId }): Promise<APIResponse<User>> => {
			try {
				const user: User | null = await prisma.user.findUnique({
					where: { id: userId },
				});

				if (!user) {
					res.status(404);
					return {
						data: null,
						message: "User not found",
						variant: "destructive"
					};
				}

				return {
					data: user,
					variant:"default"
				};
			} catch (err) {
				console.error("Error finding user:", err);
				res.status(500);
				return {
					data: null,
					message: "Internal Server Error",
					variant: "destructive"
				};
			}
		},
		PUT: async (res, { userId }, body): Promise<APIResponse<User>> => {
			try {
				const user: User | null = await prisma.user.update({
					where: { id: userId },
					data: body,
				});

				if (!user) {
					res.status(404);
					return {
						data: null,
						message: "User not found",
						variant: "destructive"
					};
				}

				return {
					data: user,
					variant:"default"
				};
			} catch (err) {
				console.error("Error updating user:", err);
				res.status(500);
				return {
					data: null,
					message: "Internal Server Error",
					variant: "destructive"
				};
			}
		},
		POST: async (res, { userId }, body): Promise<APIResponse<User>> => {
			try {
				const ifUserExists: User | null = await prisma.user.findUnique({
					where: { id: userId },
				});
				if (ifUserExists) {
					res.status(401);
					return {
						data: null,
						message: "User already exists",
						variant: "destructive"
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
						variant: "destructive"
					};
				}

				return {
					data: newUser,
					variant:"default"
				};
			} catch (err) {
				console.error("Error while creating new user:", err);
				res.status(500);
				return {
					data: null,
					message: "failed to created new user",
					variant: "destructive"
				};
			}
		},
		DELETE: async (res, { userId }): Promise<APIResponse<User>> => {
			try {
				const user = await prisma.user.delete({
					where: { id: userId },
				});

				if (!user) {
					res.status(500);
				return {
					data: null,
					message: "Failed to delete User",
					variant: "destructive"
				};
				}

				return {
					data: null,
					message:"User deleted",
					variant:"default"
				};
			} catch (err) {
				console.error("Error while creating new user", err);
				res.status(500);
				return {
					data: null,
					message: "Failed to delete User",
					variant: "destructive"
				};
			}
		},
	};
}
