import { prisma } from "@/api";
import type { APIResponse, Route } from "@/api/route";
import type { User } from "@squared/db";
import createCustomLogger from "@squared/logger";

type Params = {
	workspaceId: string;
};

const logger = createCustomLogger("workspace");

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { workspaceId }): Promise<APIResponse<User>> => {
			try {
				logger.info("Finding users for workspace: %s", workspaceId);
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
				logger.error("Error finding users: %0", err);
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
