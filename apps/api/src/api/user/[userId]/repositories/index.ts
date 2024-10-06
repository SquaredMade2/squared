import { prisma } from "@/api";
import type { Route, APIResponse } from "@/api/route";

type Params = {
	userId: string;
};

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { userId }): Promise<APIResponse<string[]>> => {
			try {
				// Fetch the user's GitHub username from the User model
				const user = await prisma.user.findFirst({
					where: { id: userId },
					select: { githubUsername: true },
				});

				if (!user || !user.githubUsername) {
					return {
						data: [],
						message: "GitHub username not found",
						variant: "destructive",
					};
				}

				// Fetch the connected repositories from the GithubRepoInfo model
				const connectedRepos = await prisma.githubRepoInfo.findMany({
					where: { owner: user.githubUsername },
					select: { repoName: true },
				});

				// Return the list of repo names
				const repoNames = connectedRepos.map((repo) => repo.repoName);
				return {
					data: repoNames,
					message: "Repositories fetched successfully",
					variant: "default",
				};
			} catch (error) {
				console.error("Error fetching connected repositories:", error);
				res.status(500);
				return {
					data: [],
					message: `Could not fetch connected repositories: ${error}`,
					variant: "destructive",
				};
			}
		},
	};
}
