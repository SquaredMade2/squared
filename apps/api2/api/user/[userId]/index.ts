import type { User } from "@repo/db";
import { prisma } from "@/api";
import type { Route } from "@/api/route";

type Params = {
	userId: string;
};

type UserResponse = {
	user : User | null,
	message?: string,
	variant: "default" | "destructive"
}

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { userId }): Promise<UserResponse> => {
			try {
				const user: User | null = await prisma.user.findUnique({
					where: { id: userId },
				});

				if (!user) {
					return {
						user: null,
						message: "User not found",
						variant: "destructive"
					};
				}

				return {
					user: user,
					variant:"default"
				};
			} catch (err) {
				console.error("Error finding user:", err);
				return {
					user: null,
					message: "Internal Server Error",
					variant: "destructive"
				};
			}
		},
		PUT: async (res, { userId }, body): Promise<UserResponse> => {
			try {
				const user: User | null = await prisma.user.update({
					where: { id: userId },
					data: body,
				});

				if (!user) {
					return {
						user: null,
						message: "User not found",
						variant: "destructive"
					};
				}

				return {
					user: user,
					variant:"default"
				};
			} catch (err) {
				console.error("Error updating user:", err);
				return {
					user: null,
					message: "Internal Server Error",
					variant: "destructive"
				};
			}
		},
		POST: async (res, { userId }, body): Promise<UserResponse> => {
			try {
				const ifUserExists: User | null = await prisma.user.findUnique({
					where: { id: userId },
				});
				if (ifUserExists) {
					return {
						user: null,
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
					return {
						user: null,
						message: "failed to created new user",
						variant: "destructive"
					};
				}

				return {
					user: newUser,
					variant:"default"
				};
			} catch (err) {
				console.error("Error while creating new user:", err);
				return {
					user: null,
					message: "failed to created new user",
					variant: "destructive"
				};
			}
		},
		DELETE: async (res, { userId }): Promise<UserResponse> => {
			try {
				const user = await prisma.user.delete({
					where: { id: userId },
				});

				if (!user) {
				return {
					user: null,
					message: "Failed to delete User",
					variant: "destructive"
				};
				}

				return {
					user: null,
					message:"User deleted",
					variant:"default"
				};
			} catch (err) {
				console.error("Error while creating new user", err);
				return {
					user: null,
					message: "Failed to delete User",
					variant: "destructive"
				};
			}
		},
	};
}
