export default {
	"/api/workspace/join": {
		post: {
			tags: ["Join"],
			summary: "Join a workspace",
			description: "Join a workspace given a user's ID and an invite token,",
			requestBody: {
				description: "The data for the new task",
				required: true,
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								token: {
									type: "string",
								},
								userId: {
									type: "string",
								},
							},
						},
					},
				},
			},
			responses: {
				200: {
					description:
						"Returns if user is already a member of the workspace or the user was successfully added to the workspace.",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									data: {
										$ref: "#/components/schemas/Workspace",
									},
									message: {
										type: "string",
									},
									variant: {
										type: "string",
									},
									status: {
										type: "number",
									},
								},
							},
						},
					},
				},
				404: {
					description: "User, workspace, or teams were not found",
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
									status: {
										type: "number",
									},
								},
							},
						},
					},
				},
				500: {
					description: "Internal server error or JWT_SECRET is not defined",
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
									status: {
										type: "number",
									},
								},
							},
						},
					},
				},
			},
		},
	},
};
