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
							$ref: "#/components/schemas/Sprint",
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
								$ref: "#/components/schemas/Sprint",
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
