import type { User } from "@repo/db";
import { prisma } from "@/api";
import type { Route } from "@/api/route";

type Params = {
	userId: string;
};

export function createRoute(): Route<Params> {
	return {
		GET: async ({ userId }) => {
			try {
				const user: User | null = await prisma.user.findUnique({
					where: { id: userId },
				});

				if (!user) {
					throw new Error("User not found.");
				}

				return user;
			} catch (err) {
				console.error("Error finding user:", err);
				throw new Error("Internal server error");
			}
		},
		PUT: async ({ userId }, body) => {
			try {
				const user: User | null = await prisma.user.update({
					where: { id: userId },
					data: body,
				});

				if (!user) {
					throw new Error("User not found");
				}

				return user;
			} catch (err) {
				console.error("Error updating user:", err);
				throw new Error("Internal server error");
			}
		},
		POST: async ({ userId }, body) => {
			try {
				const ifUserExists = await prisma.user.findUnique({
					where: { id: userId },
				});

				if (ifUserExists) {
					throw new Error("User already exists");
				}

				const newUser = await prisma.user.create({
					data: {
						id: userId,
						...body,
					} as User,
				});

				if (!newUser) {
					throw new Error("Failed to create new user");
				}

				return newUser;
			} catch (err) {
				console.error("Error while creating new user:", err);
				throw new Error("Failed to create new user");
			}
		},
		DELETE: async ({ userId }) => {
			try {
				const user = prisma.user.delete({
					where: { id: userId },
				});

				if (!user) {
					throw new Error("Failed to delete user");
				}

				return { message: "User deleted." };
			} catch (err) {
				console.error("Error while creatig new user", err);
				throw new Error("Failed to delete user");
			}
		},
	};
}
