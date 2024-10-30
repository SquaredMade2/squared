export default {
	"/api/user/{userId}/team": {
		get: {
			tags: ["Team"],
			summary: "Retrieve teams a user belongs to.",
			description:
				"Find and return an array of teams that a specific user is associated with.",
			parameters: [
				{
					in: "path",
					name: "userId",
					schema: {
						type: "string",
					},
					required: true,
					description: "The ID of the user.",
				},
			],
			responses: {
				200: {
					description: "An object containing an array of teams",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									data: {
										type: "array",
										properties: {
											items: {
												$ref: "#/components/schemas/User",
											},
										},
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
					description: "Team not found",
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
