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
			const { code, state: userId } = query;

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
				console.log(`Authenticated GitHub user: ${currentUserLogin}`);

				// Update the User with the GitHub username
				const updatedUser = await prisma.user.update({
					where: { id: userId as string },
					data: {
						githubUsername: currentUserLogin, // Store the GitHub username directly
					},
				});

				console.log(
					"User's GitHub username updated successfully:",
					updatedUser.githubUsername,
				);

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
