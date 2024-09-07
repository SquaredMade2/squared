import type { User } from "@repo/db";
import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";

type Params = {
	workspaceId: string;
};


export function createRoute(): Route<Params> {
	return {
		GET: async (res, { workspaceId }): Promise<APIResponse<User>> => {
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
					res.status(404);
					return {
						data: null,
						message: "No Users found",
						variant: "destructive"
					};
				}

				return {
					data: users,
					variant: "default"
				};
			} catch (err) {
				console.error("Error finding users:", err);
				res.status(500);
				return {
					data: null,
					message: "Internal Server Error",
					variant: "destructive"
				};
			}
		},
	};
}
