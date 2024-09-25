import { prisma } from "@/api";
const axios = require("axios");
import type { Route } from "@/api/route";

const clientId = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;

if (!clientId || !clientSecret) {
	throw new Error("Missing necessary environment variables");
}

type Installation = {
	id: number;
	account: {
		login: string;
	};
	repository_selection?: string;
	target_id: number;
};

export function createRoute(): Route {
	return {
		GET: async (res, _, query): Promise<void> => {
			const { code, state: workspaceId } = query;

			const validWorkspaceId = Array.isArray(workspaceId)
				? (workspaceId[0] as string)
				: (workspaceId as string);

			if (!code || !validWorkspaceId) {
				console.error("Missing code or workspaceId in query params");
				res.status(400).json({ message: "Missing code or workspaceId" });
				return;
			}

			try {
				// Exchange authorization code for GitHub access token
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

				// Fetch the authenticated user's details
				const userResponse = await axios.get("https://api.github.com/user", {
					headers: {
						Authorization: `token ${accessToken}`,
						Accept: "application/vnd.github.v3+json",
					},
				});
				const currentUserLogin = userResponse.data.login;
				console.log(`Authenticated GitHub user: ${currentUserLogin}`);

				// Fetch GitHub App installation information
				const installationResponse = await axios.get(
					"https://api.github.com/user/installations",
					{
						headers: {
							Authorization: `token ${accessToken}`,
							Accept: "application/vnd.github.v3+json",
						},
					},
				);

				// Find the installation related to the authenticated user
				const currentInstallation =
					installationResponse.data.installations.find(
						(installation: Installation) =>
							installation.account.login === currentUserLogin,
					);

				if (!currentInstallation) {
					console.error(
						"No installation found for the current authenticated GitHub user",
					);
					res.status(400).json({
						message: "No installation found for the authenticated user",
					});
					return;
				}

				const repoOwner = currentInstallation.account.login;
				const targetId = currentInstallation.target_id;
				const repoName = currentInstallation.repository_selection || "N/A";

				console.log(`Workspace ID: ${validWorkspaceId}`);
				console.log(`Repository Owner: ${repoOwner}`);
				console.log(`ID (GitHub Target ID): ${targetId}`);
				console.log(`Repository Name: ${repoName}`);

				// Check if GithubRepoInfo entry exists for the workspace and this targetId (now id)
				const existingRepoInfo = await prisma.githubRepoInfo.findFirst({
					where: {
						id: targetId,
						workspaceId: validWorkspaceId,
					},
				});

				if (existingRepoInfo) {
					console.log(
						`Found existing entry for workspaceId ${validWorkspaceId} and id ${targetId}. Updating...`,
					);
					// Update existing entry
					await prisma.githubRepoInfo.update({
						where: { id: existingRepoInfo.id },
						data: {
							repoName,
							owner: repoOwner,
						},
					});
					console.log(
						`Updated existing GithubRepoInfo for owner: ${repoOwner}`,
					);
				} else {
					console.log("No existing entry found. Creating new entry...");
					// If no existing entry, create a new one
					await prisma.githubRepoInfo.create({
						data: {
							id: targetId,
							repoName,
							owner: repoOwner,
							workspaceId: validWorkspaceId,
						},
					});
					console.log(`Created new GithubRepoInfo for owner: ${repoOwner}`);
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
