export default {
	"/api/workspace/{workspaceId}/team": {
		get: {
			tags: ["Team"],
			summary: "Retrieve all teams for a specific workspace",
			description:
				"Find and return all teams associated with a specific workspace ID.",
			parameters: [
				{
					in: "path",
					name: "workspaceId",
					schema: {
						type: "string",
					},
					required: true,
					description:
						"The ID of the workspace whose teams are to be retrieved",
				},
			],
			responses: {
				200: {
					description: "An array of team objects",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									data: {
										type: "array",
										items: {
											$ref: "#/components/schemas/Team",
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
					description: "Teams not found",
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
