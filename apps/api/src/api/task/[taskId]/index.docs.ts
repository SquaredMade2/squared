export default {
	"/api/task/{taskId}": {
		get: {
			tags: ["Task"],
			summary: "Retrieve a specific task by ID",
			description: "Find and return a task by its unique ID.",
			parameters: [
				{
					in: "path",
					name: "taskId",
					schema: {
						type: "string",
					},
					required: true,
					description: "The ID of the task to retrieve",
				},
			],
			responses: {
				200: {
					description: "A task object",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/Task",
							},
						},
					},
				},
				404: {
					description: "Task not found",
				},
				500: {
					description: "Internal server error",
				},
			},
		},
		put: {
			tags: ["Task"],
			summary: "Update a specific task by ID",
			description: "Update a task's information by its unique ID.",
			parameters: [
				{
					in: "path",
					name: "taskId",
					schema: {
						type: "string",
					},
					required: true,
					description: "The ID of the task to update",
				},
			],
			requestBody: {
				description: "The updated task data",
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
				200: {
					description: "The updated task object",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/Task",
							},
						},
					},
				},
				404: {
					description: "Task not found",
				},
				500: {
					description: "Internal server error",
				},
			},
		},
		post: {
			tags: ["Task"],
			summary: "Create a new task",
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
		delete: {
			tags: ["Task"],
			summary: "Delete a specific task by ID",
			description:
				"Delete a task by its unique ID. If the task does not exist, an error will be returned.",
			parameters: [
				{
					in: "path",
					name: "taskId",
					schema: {
						type: "string",
					},
					required: true,
					description: "The ID of the task to delete",
				},
			],
			responses: {
				200: {
					description: "Success message indicating the task was deleted",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									message: {
										type: "string",
										example: "Task deleted",
									},
								},
							},
						},
					},
				},
				404: {
					description: "Task not found",
				},
				500: {
					description: "Internal server error",
				},
			},
		},
	},
};
