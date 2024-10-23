export default {
	"/api/team/{teamId}/task": {
		get: {
			tags: ["Task"],
			summary: "Retrieve all tasks for a specific team",
			description:
				"Find and return all tasks associated with a specific team ID.",
			parameters: [
				{
					in: "path",
					name: "teamId",
					schema: {
						type: "string",
					},
					required: true,
					description: "The ID of the team whose tasks are to be retrieved",
				},
			],
			responses: {
				200: {
					description: "An array of task objects",
					content: {
						"application/json": {
							schema: {
								type: "array",
								items: {
									$ref: "#/components/schemas/Task",
								},
							},
						},
					},
				},
				404: {
					description: "Tasks not found",
				},
				500: {
					description: "Internal server error",
				},
			},
		},
	},
};
