import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";

type Params = {
	workspaceId: string;
};

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { workspaceId }): Promise<APIResponse<string[]>> => {
			try {
				const workspace = await prisma.workspace.findUnique({
					where: { id: workspaceId },
					include: {
						githubRepoInfo: true,
					},
				});

				if (
					!workspace ||
					!workspace.githubRepoInfo ||
					!workspace.githubRepoInfo.repoName
				) {
					res.status(404);
					return {
						data: null,
						message: "No connected repositories found",
						variant: "destructive",
					};
				}

				const connectedRepos = [workspace.githubRepoInfo.repoName];

				return {
					data: connectedRepos,
					variant: "default",
				};
			} catch (error) {
				console.error("Error fetching connected repositories:", error);
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
