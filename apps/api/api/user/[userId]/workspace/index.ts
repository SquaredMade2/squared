import type { Workspace } from "@repo/db";
import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";

type Params = {
	userId: string;
	workspaceId: string;
};

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { userId }): Promise<APIResponse<Workspace>> => {
			try {
				// Find workspaces a certain user belongs to

				const userWorkspaces: Workspace[] = await prisma.userWorkspace
					.findMany({
						where: { userId },
						include: {
							workspace: {
								include: {
									Labels: true,
								},
							},
						},
					})
					.then((workspaces) =>
						workspaces.map((workspace) => workspace.workspace),
					);

				if (!userWorkspaces) {
					return {
						data: null,
						message: "Workspace not found",
						variant: "destructive",
					};
				}

				// Return the found workspaces
				return {
					data: userWorkspaces,
					message: "",
					variant: "default",
				};
			} catch (error) {
				console.error("Error finding user workspaces:", error);
				res.status(500);
				return {
					data: null,
					message: "Internal Sever Error",
					variant: "destructive",
				};
			}
		},
	};
}
