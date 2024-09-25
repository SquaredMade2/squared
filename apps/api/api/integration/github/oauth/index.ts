import { prisma } from "@/api";
import { v4 as uuidv4 } from "uuid";
const axios = require("axios");
import type { Route } from "@/api/route";

const clientId = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;

if (!clientId || !clientSecret) {
	throw new Error("Missing necessary environment variables");
}

export function createRoute(): Route {
	return {
		GET: async (res, _, query): Promise<void> => {
			const { code, state: workspaceId } = query; // extract code and workspaceId from query params

			const validWorkspaceId = Array.isArray(workspaceId)
				? (workspaceId[0] as string)
				: (workspaceId as string);

			if (!code || !validWorkspaceId) {
				console.error("Missing code or workspaceId in query params");
				res.status(400).json({ message: "Missing code or workspaceId" });
				return;
			}

			try {
				// exchange authorization code for GitHub access token
				const tokenResponse = await axios.post(
					"https://github.com/login/oauth/access_token",
					{
						client_id: clientId,
						client_secret: clientSecret,
						code,
					},
					{ headers: { Accept: "application/json" } },
				);

				const accessToken = tokenResponse.data.access_token;
				console.log("Access token received from GitHub:", accessToken);

				// fetch GitHub App installation information
				const installationResponse = await axios.get(
					"https://api.github.com/user/installations",
					{
						headers: {
							Authorization: `token ${accessToken}`,
							Accept: "application/vnd.github.v3+json",
						},
					},
				);

				const repoName =
					installationResponse.data.installations[0].repository_selection;
				const repoOwner =
					installationResponse.data.installations[0].account.login;

				// check if GithubRepoInfo entry exists for workspace; update if true, else create new entry
				const existingRepoInfo = await prisma.githubRepoInfo.findFirst({
					where: { workspaceId: validWorkspaceId },
				});

				if (existingRepoInfo) {
					await prisma.githubRepoInfo.update({
						where: { id: existingRepoInfo.id },
						data: {
							repoName,
							owner: repoOwner,
						},
					});
					console.log("Updated existing GithubRepoInfo with new repo details.");
				} else {
					await prisma.githubRepoInfo.create({
						data: {
							id: uuidv4(),
							repoName,
							owner: repoOwner,
							workspaceId: validWorkspaceId,
						},
					});
					console.log("Created new GithubRepoInfo entry.");
				}

				res.redirect(
					"https://github.com/apps/SquaredMadeApp/installations/new",
				);
			} catch (error) {
				console.error("Error during OAuth processing:", error);
				res.status(500).json({ message: "Error during OAuth" });
			}
		},
	};
}
