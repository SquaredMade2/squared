export default {
	"api/team/{teamId}/sprints/{sprintId}": {
		post: {
			tags: ["Sprint"],
			summary: "Create a new sprint for a specific team",
			description:
				"Initialize a sprint for a team, specifying name, start date, end date, and status.",
			parameters: [
				{
					in: "path",
					name: "teamId",
					schema: { type: "string" },
					required: true,
					description: "The ID of the team for which to create the sprint",
				},
			],
			requestBody: {
				description: "The data for a newly created sprint",
				required: true,
				content: {
					"application/json": {
						schema: {
							type: "object",
							$ref: "#/components/schemas/Sprint",
						},
					},
				},
			},
			responses: {
				200: {
					description: "The newly created sprint object",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/Sprint",
							},
						},
					},
				},
				404: { description: "Team not found" },
				500: { description: "Internal server error" },
			},
		},
	},
	put: {
		tags: ["Sprint"],
		summary: "Update an existing sprint for a specific team",
		description:
			"Update details of a specific sprint, including name, start date, end date, and status.",
		parameters: [
			{
				in: "path",
				name: "teamId",
				schema: { type: "string" },
				required: true,
				description: "The ID of the team to which the sprint belongs",
			},
			{
				in: "path",
				name: "sprintId",
				schema: { type: "string" },
				required: true,
				description: "The ID of the sprint to be updated",
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
				description: "Sprint successfully updated",
				content: {
					"application/json": {
						schema: {
							$ref: "#/components/schemas/Sprint",
						},
					},
				},
			},
			404: { description: "Sprint not found or does not belong to the team" },
			500: { description: "Internal server error" },
		},
	},
};
