import type { User } from "@repo/db";
import { prisma } from "@/api";
import type { Route } from "@/api/route";

type Params = {
	workspaceId: string;
};

type UserResponse = {
	users : User[] | null,
	message?: string,
	variant: "default" | "destructive"
}

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { workspaceId }): Promise<UserResponse> => {
			try {
				const users: User[] | null = await prisma.user.findMany({
					where: {
						Workspaces: {
							some: {
								workspaceId: workspaceId,
							},
						},
					},
				});

				if (!users) {
					return {
						users: null,
						message: "No Users found",
						variant: "destructive"
					};
				}

				return {
					users: users,
					variant: "default"
				};
			} catch (err) {
				console.error("Error finding users:", err);
				return {
					users: null,
					message: "Internal Server Error",
					variant: "destructive"
				};
			}
		},
	};
}
