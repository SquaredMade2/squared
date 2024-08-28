import type { User } from "@repo/db";
import { prisma } from "@/api";
import type { Route } from "@/api/route";

type Params = {
	workspaceId: string;
};

export function createRoute(): Route<Params> {
	return {
		GET: async ({ workspaceId }) => {
			try {
				const users: User[] | null = await prisma.user.findMany({
					where: {
						Workspaces: {
							some: {
								id: workspaceId,
							},
						},
					},
				});

				if (!users) {
					throw new Error("No users found");
				}

				return users;
			} catch (err) {
				console.error("Error finding users:", err);
				throw new Error("Internal server error");
			}
		},
	};
}
