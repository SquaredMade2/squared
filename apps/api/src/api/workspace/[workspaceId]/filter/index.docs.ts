export default {
	"/api/workspace/{workspaceId}/filter": {
		get: {
			tags: ["Filter"],
			summary: "Retrieve a list of filters by workspace ID",
			description: "Find and return a list of filters by workspace ID.",
			parameters: [
				{
					in: "path",
					name: "workspaceId",
					schema: {
						type: "string",
					},
					required: true,
					description: "The ID of the workspace associated with saved filters.",
				},
			],
			responses: {
				200: {
					description: "A list of retrieved filters.",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									data: {
										type: "array",
										items: {
											$ref: "#/components/schemas/SavedFilter",
										},
									},
								},
							},
						},
					},
				},
				404: {
					description: "Filters not found",
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
