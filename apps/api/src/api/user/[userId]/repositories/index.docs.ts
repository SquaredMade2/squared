export default {
	"/api/user/{userId}/repositories": {
		get: {
			tags: ["User"],
			summary: "Retrieve repo names",
			description:
				"Find and return a list of repository names associated with a specific user's github account.",
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
					description: "An object containing an array of repo names.",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									data: {
										type: "array",
										items: {
											type: "string",
										},
									},
									message: {
										type: "string",
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
					description: "GitHub username not found",
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
