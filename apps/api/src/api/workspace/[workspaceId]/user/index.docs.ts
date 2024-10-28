export default {
	"/api/workspace/{workspaceId}/user": {
		get: {
			tags: ["User"],
			summary: "Retrieve all users for a specific workspace",
			description:
				"Find and return all users associated with a specific workspace ID.",
			parameters: [
				{
					in: "path",
					name: "workspaceId",
					schema: {
						type: "string",
					},
					required: true,
					description:
						"The ID of the workspace whose users are to be retrieved",
				},
			],
			responses: {
				200: {
					description: "An array of user objects",
					content: {
						"application/json": {
							schema: {
								type: "array",
								items: {
									$ref: "#/components/schemas/User",
								},
							},
						},
					},
				},
				404: {
					description: "Users not found",
				},
				500: {
					description: "Internal server error",
				},
			},
		},
	},
};
