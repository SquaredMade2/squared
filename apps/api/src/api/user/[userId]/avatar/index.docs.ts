export default {
	"/api/user/{userId}/avatar": {
		get: {
			tags: ["User"],
			summary: "User avatars",
			description:
				"Find and return an array of user avatars from all workspaces associated with a specific user.",
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
					description: "User avatars array and variant.",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									data: {
										type: "array",
										properties: {
											items: "#/components/schemas/UserAvatar",
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
					description: "User is not part of any workspace",
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
