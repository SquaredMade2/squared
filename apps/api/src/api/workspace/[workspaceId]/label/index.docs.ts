export default {
	"/api/workspace/{workspaceId}/label": {
		get: {
			tags: ["Workspace"],
			summary: "Retrieve a list of labels by workspace ID",
			description: "Find and return a list of labels by workspace ID.",
			parameters: [
				{
					in: "path",
					name: "workspaceId",
					schema: {
						type: "string",
					},
					required: true,
					description: "The ID of the workspace associated with the labels.",
				},
			],
			responses: {
				200: {
					description: "A list of retrieved labels.",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									data: {
										type: "array",
										items: {
											$ref: "#/components/schemas/Label",
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
