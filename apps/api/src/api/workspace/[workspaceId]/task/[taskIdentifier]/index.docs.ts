export default {
	"/api/workspace/{workspaceId}/task/{taskIdentifier}": {
		get: {
			tags: ["Workspace"],
			summary:
				"Retrieve a task within a specific workspace by the tasks unique system identifier.",
			description:
				"Find and return a task within a specific workspace by its unique system identifier.",
			parameters: [
				{
					in: "path",
					name: "workspaceId",
					schema: {
						type: "string",
					},
					required: true,
					description: "The ID of the workspace associated with the task.",
				},
				{
					in: "path",
					name: "taskIdentifier",
					schema: {
						type: "string",
					},
					required: true,
					description: "A unique system identifier for a task.",
				},
			],
			responses: {
				200: {
					description: "A task.",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									data: {
										$ref: "#/components/schemas/Task",
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
					description: "Task not found",
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
