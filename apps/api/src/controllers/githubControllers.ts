import type { Request, Response } from "express";
import axios from "axios";
import Task from "../models/task";
import { TaskEventModel } from "../models/events";

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
	const eventType = req.headers["x-github-event"];
	const branchName = payload.ref.split("/").pop();
	let gitUpdate = "";

	console.log("Webhook payload received:", JSON.stringify(payload, null, 2));
	if (eventType === "create" && payload.ref_type === "branch") {
		gitUpdate = `Branch ${branchName} created in repository ${payload.repository.full_name}`;
	} else if (eventType === "push") {
		type Commit = {
			id: string;
			url: string;
		};

		// Prepare commit links
		const commitLinks = payload.commits
			.map((commit: Commit) => {
				return `Commit ${commit.id.substring(0, 7)}: ${commit.url}`;
			})
			.join("\n");

		gitUpdate = `Branch ${branchName} updated in repository ${payload.repository.full_name} with the following commits:\n${commitLinks}`;
	} else {
		console.log("No relevant event type");
		return res.status(200).send("No relevant event type");
	}

	// Extract task identifier from branch name
	const identifierPattern = /([A-Z]{2,}-\d+)/i;
	const match = branchName?.match(identifierPattern);

	if (match) {
		const identifier = match[1].toUpperCase();

		try {
			// Find the task by the extracted identifier, ignoring case
			const task = await Task.findOne({
				identifier: new RegExp(`^${identifier}$`, "i"),
			});

			if (task) {
				const authorId = task._id;
				const authorName =
					payload.pusher?.name || payload.sender.login || "Unknown User"; // Default name if not provided
				// Create a new task event
				const newTaskEvent = new TaskEventModel({
					type: "gitUpdated",
					author: {
						id: authorId,
						name: authorName,
					},
					taskId: task._id,
					updatedAt: new Date(),
					gitUpdate,
				});

				await newTaskEvent.save();

				console.log(`Task event created for task ${identifier}`);
			} else {
				console.log(`No task found for identifier ${identifier}`);
			}
		} catch (error) {
			console.error("Error handling webhook:", error);
		}
	} else {
		console.log("No task identifier found in branch name");
	}

	res.status(200).send("Webhook received");
};
