import type { Workspace } from "@squared/db";
import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";
import createCustomLogger from "@squared/logger";

type Params = {
	userId: string;
	workspaceId: string;
};

const logger = createCustomLogger("workspace");

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { userId }): Promise<APIResponse<Workspace>> => {
			try {
				// Find workspaces a certain user belongs to
				logger.info("Finding user workspaces");
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
				logger.error("Error finding user workspaces:", error);
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
