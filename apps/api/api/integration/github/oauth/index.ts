import { prisma } from "@/api";
import axios from "axios";
import type { Route } from "@/api/route";

const clientId = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;

if (!clientId || !clientSecret) {
	throw new Error(
		`Missing necessary environment variables: ${
			!clientId ? "GITHUB_CLIENT_ID " : ""
		}${!clientSecret ? "GITHUB_CLIENT_SECRET" : ""}`,
	);
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

				// Fetch the authenticated GitHub user's details
				const userResponse = await axios.get("https://api.github.com/user", {
					headers: {
						Authorization: `token ${accessToken}`,
						Accept: "application/vnd.github.v3+json",
					},
				});

				const currentUserLogin = userResponse.data.login;

				if (typeof userId !== "string") {
					res.status(400).json({ message: "Invalid userId" });
					return;
				}

				await prisma.user.update({
					where: { id: userId },
					data: {
						githubUsername: currentUserLogin,
					},
				});

				// Redirect to GitHub's App installation page
				res.redirect(
					"https://github.com/apps/SquaredMadeApp/installations/new",
				);
			} catch (error) {
				console.error(
					`Error processing OAuth: ${error instanceof Error ? error.message : error}`,
				);
				res.status(500).json({
					message: `Error during OAuth: ${error instanceof Error && `: ${error.message}`}`,
				});
			}
		},
	};
}
