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

		res.redirect("https://github.com/apps/SquaredMadeApp/installations/new");
	} catch (error) {
		console.error("Error exchanging code for token:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const handleWebhook = async (req: Request, res: Response) => {
	const payload = req.body;

	// Log the entire payload to see what GitHub is sending
	console.log("Webhook payload received:", JSON.stringify(payload, null, 2));

	if (payload.action === "push") {
		console.log(
			`Received a push event for repository: ${payload.repository.name}`,
		);
	}

	const eventType = req.headers["x-github-event"];

	// if eventType == create ==> created Branch
	// if eventType ==

	console.log("Received a webhook event:", req.headers["x-github-event"]);
	if (eventType === "push") {
		console.log(
			`Received a push event for repository: ${payload.repository.name}`,
		);
	}

	res.status(200).send("Webhook received");
};
