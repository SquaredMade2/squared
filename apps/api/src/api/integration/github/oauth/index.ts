import { prisma } from "@/api";
import type { Route } from "@/api/route";
import createCustomLogger from "@squared/logger";
import axios from "axios";

const clientId = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;

if (!clientId || !clientSecret) {
	throw new Error(
		`Missing necessary environment variables: ${
			!clientId ? "GITHUB_CLIENT_ID " : ""
		}${!clientSecret ? "GITHUB_CLIENT_SECRET" : ""}`,
	);
}

const logger = createCustomLogger("integrations");

export function createRoute(): Route {
	return {
		GET: async (res, _, query): Promise<void> => {
			logger.info("Received OAuth callback request");
			const { code, state: userId } = query;

			if (!code || !userId) {
				logger.error("Missing code or userId in query params");
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

				try {
					await prisma.user.update({
						where: { id: userId },
						data: {
							githubUsername: currentUserLogin,
						},
					});
				} catch (error) {
					logger.warn("Failed to update user with GitHub username: %0", error);
				}

				// Redirect to GitHub's App installation page
				res.redirect(
					"https://github.com/apps/SquaredMadeApp/installations/new",
				);
			} catch (error) {
				logger.error("Error processing OAuth: %0", error);
				res.status(500).json({
					message: `Error during OAuth: ${error instanceof Error && `: ${error.message}`}`,
				});
			}
		},
	};
}
