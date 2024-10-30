export default {
	"/api/workspace/{workspaceId}/invite": {
		post: {
			tags: ["Workspace"],
			summary:
				"Create and send an invite(s) to a user or group of users to join a workspace.",
			description:
				"Create a new task with a given ID. If a task with the provided ID already exists, an error will be returned.",
			parameters: [
				{
					in: "path",
					name: "taskId",
					schema: {
						type: "string",
					},
					required: true,
					description: "The ID of the new task",
				},
			],
			requestBody: {
				description: "The data for the new task",
				required: true,
				content: {
					"application/json": {
						schema: {
							$ref: "#/components/schemas/Task",
						},
					},
				},
			},
			responses: {
				201: {
					description: "The newly created task object",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/Task",
							},
						},
					},
				},
				400: {
					description: "Task already exists",
				},
				500: {
					description: "Internal server error",
				},
			},
		},
	},
};
