import type { Request, Response } from "express";
import axios from "axios";

const clientId = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;
const appId = process.env.GITHUB_APP_ID;
const privateKey = process.env.GITHUB_PRIVATE_KEY?.replace(/\\n/g, "\n");

// Ensure environment variables are correctly defined
if (!clientId || !clientSecret || !appId || !privateKey) {
	throw new Error("Missing necessary environment variables");
}

export const handleOAuthCallback = async (req: Request, res: Response) => {
	const { code } = req.query;

	try {
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

		res.redirect(
			`http://localhost:3000/workspace/work/settings/integrations/github?token=${access_token}`,
		);
	} catch (error) {
		console.error("Error exchanging code for token:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
