import { Workspace } from "@repo/db";
import { prisma } from "@/api";
import type { Route } from "@/api/route";

type Params = {
	userId: string;
	workspaceId: string;
};

export function createRoute({}): Route<Params> {
	return {
		GET: async ({ userId }) => {
			try {
				// Find workspaces a certain user belongs to

				const userWorkspaces: Workspace[] = await prisma.userWorkspace
					.findMany({ where: { userId }, include: { workspace: true } })
					.then((workspaces) =>
						workspaces.map((workspace) => workspace.workspace),
					);

				if (!userWorkspaces) {
					throw new Error("Workspace not found");
				}

				// Return the found workspaces
				return userWorkspaces;
			} catch (error) {
				console.error("Error finding user workspaces:", error);
				throw new Error("Internal server error");
			}
		},
	};
}
