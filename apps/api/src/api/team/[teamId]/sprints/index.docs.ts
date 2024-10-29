export default {
	"api/team/{teamId}/sprints": {
		get: {
			tags: ["Sprints"],
			summary: "Retrieve all sprints for a specific team",
			description:
				"Fetch a list of sprints associated with the specified team ID.",
			parameters: [
				{
					in: "path",
					name: "teamId",
					schema: { type: "string" },
					required: true,
					description: "The ID of the team whose sprints are to be retreived",
				},
			],
			responses: {
				200: {
					description: "An array of sprint objects",
					content: {
						"application/json": {
							schema: {
								type: "array",
								items: {
									$ref: "#/components/schemas/Sprint",
								},
							},
						},
					},
				},
				404: {
					description: "Team not found",
				},
				400: { description: "Sprints are not enabled for this team" },
				500: {
					description: "Internal server error",
				},
			},
		},
	},
	post: {
		tags: ["Sprint"],
		summary: "Initialize sprints for a specific team",
		description:
			"Create a specified number of sprints for a team, starting from a given start date.",
		parameters: [
			{
				in: "path",
				name: "teamId",
				schema: { type: "string" },
				required: true,
				description: "The ID of the team for which to initialize sprints",
			},
		],
		requestBody: {
			description: "The data for newly created sprints",
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
				description: "Array of created sprints",
				content: {
					"application/json": {
						schema: {
							type: "array",
							items: {
								$ref: "#/components/schemas/Sprint",
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
};
