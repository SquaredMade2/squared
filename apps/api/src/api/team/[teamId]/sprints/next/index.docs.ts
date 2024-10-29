export default {
	"api/team/{teamId}/sprints/next": {
		put: {
			tags: ["Sprint"],
			summary: "Initialize or update a sprint for a team",
			description:
				"Creates a new sprint or updates an existing one, moving specified tasks to the new sprint. Marks any previous active sprints as `COMPLETED`. Requires that sprints are enabled for the team.",
			parameters: [
				{
					in: "path",
					name: "teamId",
					schema: { type: "string" },
					required: true,
					description: "The ID of the team to which the sprint belongs",
				},
			],
			requestBody: {
				description: "Sprint details to be updated",
				required: true,
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								movedTasks: {
									type: "array",
									items: { type: "string" },
									description:
										"Array of task IDs to move to the new or current active sprint",
								},
								sprintData: {
									$ref: "#/components/schemas/Sprint",
									description: "Data with which to create or update a sprint",
								},
							},
						},
					},
				},
			},
			responses: {
				200: {
					description: "Sprint successfully initialized or updated",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									data: {
										$ref: "#/components/schemas/Sprint",
									},
									message: {
										type: "string",
										description: "Success message",
										example: "Successfully created sprint: Sprint 1",
									},
									variant: {
										type: "string",
										description: "Response message type",
										example: "default",
									},
								},
							},
						},
					},
				},
				404: { description: "Team not found" },
				400: { description: "Sprints are not enabled for this team" },
				500: { description: "Internal server error" },
			},
		},
	},
};
