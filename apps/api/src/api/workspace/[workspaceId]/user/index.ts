import type { User } from "@squared/db";
import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";

type Params = {
	workspaceId: string;
};

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { workspaceId }): Promise<APIResponse<User>> => {
			try {
				const workspace = await prisma.workspace.findUnique({
					where: { id: workspaceId },
					include: {
						Users: true,
					},
				});
				const userWorkspaces = workspace?.Users;
				if (!userWorkspaces) {
					res.status(404);
					return {
						data: null,
						message: "No Users found",
						variant: "destructive",
					};
				}
				const users = await prisma.user.findMany({
					where: {
						id: {
							in: userWorkspaces.map((u) => u.userId),
						},
					},
				});

				if (!users) {
					return {
						data: null,
						message: "No Users found",
						variant: "destructive",
					};
				}

				return {
					data: users,
					variant: "default",
				};
			} catch (err) {
				console.error("Error finding users:", err);
				res.status(500);
				return {
					data: null,
					message: "Internal Server Error",
					variant: "destructive",
				};
			}
		},
	};
}
