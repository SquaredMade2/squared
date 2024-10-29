export default {
	"/api/integration/github/webhook": {
		post: {
			tags: ["Integration"],
			summary: "Handle GitHub webhook events",
			description:
				"Processes webhook events from GitHub such as repository installations, branch creations, and push events.",
			parameters: [
				{
					in: "header",
					name: "X-GitHub-Event",
					schema: {
						type: "string",
					},
					required: true,
					description:
						"Specifies the type of GitHub event that triggered the webhook. Common events include push, pull_request, and create.",
				},
			],
			requestBody: {
				description:
					"The JSON payload sent by GitHub webhooks containing event data.",
				required: true,
				content: {
					"application/json": {
						schema: {
							type: "object",
							description: "Payload delivered by GitHub webhooks.",
							additionalProperties: true,
						},
					},
				},
			},
			responses: {
				200: {
					description: "Webhook processed successfully.",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									message: {
										type: "string",
										example: "Webhook processed successfully",
									},
								},
							},
						},
					},
				},
				204: {
					description:
						"No action taken because the event type is not relevant to the system's needs.",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									message: {
										type: "string",
										example: "No relevant event type",
									},
								},
							},
						},
					},
				},
				500: {
					description: "Internal server error during webhook processing.",
				},
			},
		},
	},
};
