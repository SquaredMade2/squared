import type { Workspace } from "@repo/db";
import { prisma } from "@/api";
import type { Route } from "@/api/route";

type Params = {
	userId: string;
	workspaceId: string;
};

type WorkspaceResponse = {
	workspaces : Workspace[] | null,
	message: string,
	variant: "default" | "destructive"
}

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { userId }): Promise<WorkspaceResponse> => {
			try {
				// Find workspaces a certain user belongs to

				const userWorkspaces: Workspace[] = await prisma.userWorkspace
					.findMany({ where: { userId }, include: { workspace: true } })
					.then((workspaces) =>
						workspaces.map((workspace) => workspace.workspace),
					);

				if (!userWorkspaces) {
					return {
						workspaces: null,
						message: "Workspace not found",
						variant: "destructive"
					};
				}

				// Return the found workspaces
				return {
					workspaces: userWorkspaces,
					message: "",
					variant: "default"
				};
			} catch (error) {
				console.error("Error finding user workspaces:", error);
				return {
					workspaces: null,
					message: "Internal Sever Error",
					variant: "destructive"
				};
			}
		},
	};
}
