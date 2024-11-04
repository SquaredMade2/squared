export default {
	"/api/integration/github/oauth": {
		get: {
			tags: ["Integration"],
			summary: "Handles GitHub OAuth callback and user database update.",
			description:
				"Exchanges the GitHub authorization code for an access token. This access token is used to retrieve the user's GitHub username, which is then updated in the database. Finally, the user is redirected to the GitHub App installation page.",
			parameters: [
				{
					in: "query",
					name: "code",
					schema: {
						type: "string",
					},
					required: true,
					description:
						"The authorization code returned by GitHub after user authorization.",
				},
				{
					in: "query",
					name: "state",
					schema: {
						type: "string",
					},
					required: true,
					description:
						"The userID used to maintain state between the request and callback.",
				},
			],
			responses: {
				302: {
					description: "Redirect to GitHub's App installation page.",
					headers: {
						Location: {
							schema: {
								type: "string",
								format: "uri",
							},
							description: "URL to redirect the client to.",
						},
					},
				},
				400: {
					description: "Bad request due to missing code or userId.",
				},
				500: {
					description: "Internal server error during OAuth processing.",
				},
			},
		},
	},
};
