export default {
	"/api/task/{taskId}/comment": {
		get: {
			tags: ["Comment"],
			summary: "Retrieve all comments for a specific task",
			description:
				"Find and return all comments associated with a specific task ID.",
			parameters: [
				{
					in: "path",
					name: "taskId",
					schema: {
						type: "string",
					},
					required: true,
					description: "The ID of the task whose comments are to be retrieved",
				},
			],
			responses: {
				200: {
					description: "An array of comment objects",
					content: {
						"application/json": {
							schema: {
								type: "array",
								items: {
									$ref: "#/components/schemas/Comment",
								},
							},
						},
					},
				},
				404: {
					description: "Comments not found",
				},
				500: {
					description: "Internal server error",
				},
			},
		},
	},
};
