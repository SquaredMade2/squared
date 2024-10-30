export default {
	"/api/workspace/{workspaceId}/invite": {
		post: {
			tags: ["Workspace"],
			summary:
				"Create and send an invite(s) to a user or group of users to join a workspace.",
			description:
				"Invite token sent to users found by their emails to join a specific workspace.",
			parameters: [
				{
					in: "path",
					name: "workspaceId",
					schema: {
						type: "string",
					},
					required: true,
					description:
						"The ID of the workspace that the invites are being sent for.",
				},
			],
			requestBody: {
				description: "The data for the new task",
				required: true,
				content: {
					"application/json": {
						schema: {
							oneOf: {
								email: {
									type: "string",
								},
								emails: {
									type: "array",
									items: {
										type: "string",
									},
								},
							},
						},
					},
				},
			},
			responses: {
				201: {
					description: "Invitation sent successfully",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									data: {
										type: "null",
									},
									message: {
										type: "string",
									},
									variant: {
										type: "string",
									},
								},
							},
						},
					},
				},
				404: {
					description: "Workspace not found",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/InvalidError",
							},
						},
					},
				},
				500: {
					description: "Internal server error or JWT_SECRET is not defined",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/InternalServerError",
							},
						},
					},
				},
			},
		},
	},
};
