export default {
	"/api/user/{userId}/workspace": {
		get: {
			tags: ["Workspace"],
			summary: "Retrieve all workspaces for a specific user",
			description:
				"Find and return all workspaces associated with a specific user ID.",
			parameters: [
				{
					in: "path",
					name: "userId",
					schema: {
						type: "string",
					},
					required: true,
					description:
						"The ID of the user whose workspaces are to be retrieved",
				},
			],
			responses: {
				200: {
					description: "An array of workspace objects",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									data: {
										type: "array",
										items: {
											$ref: "#/components/schemas/Workspace",
										},
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
					description: "Workspaces not found",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/InvalidError",
							},
						},
					},
				},
				500: {
					description: "Internal server error",
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
