export default {
	"/api/workspace/{workspaceId}": {
		get: {
			tags: ["Workspace"],
			summary: "Retrieve a specific workspace by ID",
			description: "Find and return a workspace by its unique ID.",
			parameters: [
				{
					in: "path",
					name: "workspaceId",
					schema: {
						type: "string",
					},
					required: true,
					description: "The ID of the workspace to retrieve",
				},
			],
			responses: {
				200: {
					description: "A workspace object",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/Workspace",
							},
						},
					},
				},
				404: {
					description: "Workspace not found",
				},
				500: {
					description: "Internal server error",
				},
			},
		},
		post: {
			tags: ["Workspace"],
			summary: "Create a new workspace",
			description:
				"Create a new workspace with a given ID. If a workspace with the provided ID already exists, an error will be returned.",
			parameters: [
				{
					in: "path",
					name: "workspaceId",
					schema: {
						type: "string",
					},
					required: true,
					description: "The ID of the new workspace",
				},
			],
			requestBody: {
				description: "The data for the new workspace",
				required: true,
				content: {
					"application/json": {
						schema: {
							$ref: "#/components/schemas/Workspace",
						},
					},
				},
			},
			responses: {
				201: {
					description: "The newly created workspace object",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/Workspace",
							},
						},
					},
				},
				400: {
					description: "Workspace already exists",
				},
				500: {
					description: "Internal server error",
				},
			},
		},
		put: {
			tags: ["Workspace"],
			summary: "Update a specific workspace by ID",
			description: "Update a workspace's information by its unique ID.",
			parameters: [
				{
					in: "path",
					name: "workspaceId",
					schema: {
						type: "string",
					},
					required: true,
					description: "The ID of the workspace to update",
				},
			],
			requestBody: {
				description: "The updated workspace data",
				required: true,
				content: {
					"application/json": {
						schema: {
							$ref: "#/components/schemas/Workspace",
						},
					},
				},
			},
			responses: {
				200: {
					description: "The updated workspace object",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/Workspace",
							},
						},
					},
				},
				404: {
					description: "Workspace not found",
				},
				500: {
					description: "Internal server error",
				},
			},
		},
		delete: {
			tags: ["Workspace"],
			summary: "Delete a specific workspace by ID",
			description:
				"Delete a workspace by its unique ID. If the workspace does not exist, an error will be returned.",
			parameters: [
				{
					in: "path",
					name: "workspaceId",
					schema: {
						type: "string",
					},
					required: true,
					description: "The ID of the workspace to delete",
				},
			],
			responses: {
				200: {
					description: "Success message indicating the workspace was deleted",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									message: {
										type: "string",
										example: "Workspace deleted",
									},
								},
							},
						},
					},
				},
				404: {
					description: "Workspace not found",
				},
				500: {
					description: "Internal server error",
				},
			},
		},
	},
};
