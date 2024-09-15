const axios = require("axios");
import type { Route, APIResponse } from "@/api/route";

const clientId = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;

if (!clientId || !clientSecret) {
	throw new Error("Missing necessary environment variables");
}

type Params = {
	code: string;
};

export function createRoute(): Route<Params> {
	return {
		GET: async (res, { code }): Promise<void> => {
			try {
				// exchange the authorization code for an access token
				const response = await axios.post(
					"https://github.com/login/oauth/access_token",
					{
						client_id: clientId,
						client_secret: clientSecret,
						code,
					},
					{
						headers: { Accept: "application/json" },
					},
				);

				const { access_token } = response.data;

				// Redirect the user to install the GitHub App
				res.redirect(
					"https://github.com/apps/SquaredMadeApp/installations/new",
				);
			} catch (error) {
				console.error("Error exchanging code for token:", error);
				res.status(500);
			}
		},
	};
}
