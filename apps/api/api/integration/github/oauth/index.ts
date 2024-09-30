import { prisma } from "@/api";
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
			const { code, state: userId } = query; // Directly using `userId` from query

			if (!code || !userId) {
				console.error("Missing code or userId in query params");
				res.status(400).json({ message: "Missing code or userId" });
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

				// Fetch the authenticated GitHub user's details
				const userResponse = await axios.get("https://api.github.com/user", {
					headers: {
						Authorization: `token ${accessToken}`,
						Accept: "application/vnd.github.v3+json",
					},
				});
				const currentUserLogin = userResponse.data.login;
				const githubId = userResponse.data.id; // GitHub user ID
				console.log(`Authenticated GitHub user: ${currentUserLogin}`);

				// Check if the user has a GithubUser entry
				const existingGithubUser = await prisma.githubUser.findFirst({
					where: { userId: userId as string },
				});

				if (existingGithubUser) {
					console.log(
						"GitHub user already exists, updating GitHub info if necessary...",
					);
					await prisma.githubUser.update({
						where: { id: existingGithubUser.id },
						data: {
							githubId: githubId.toString(),
							login: currentUserLogin, // Update GitHub login/username if needed
						},
					});
					console.log("GitHub user updated successfully.");
				} else {
					console.log("Creating a new GithubUser entry...");
					// Create a new GithubUser if it doesn't exist
					await prisma.githubUser.create({
						data: {
							userId: userId as string, // Directly use userId from query
							githubId: githubId.toString(), // Store GitHub ID
							login: currentUserLogin, // Store GitHub username (login)
						},
					});
					console.log("GithubUser created successfully.");
				}

				// Redirect to GitHub's App installation page
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
