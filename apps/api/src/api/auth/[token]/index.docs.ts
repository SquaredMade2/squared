export default {
	"/api/auth/{token}": {
		post: {
			tags: ["Authentication"],
			summary: "Verifies the user",
			description:
				"Uses a JWT from the email sent to the user to verify that the user is real and the email is correct",
			parameters: [
				{
					in: "path",
					name: "token",
					schema: {
						type: "string",
					},
					required: true,
					description: "The token the is signed with the user data",
				},
			],
			responses: {
				200: {
					description: "verified the user",
					content: {
						"application/json": {
							schema: {
								data: {
									type: "object",
									properties: {
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
				},
				400: {
					description: "Invalid or missing token",
				},
				404: {
					description: "User not found",
				},
				500: {
					description: "Internal server error",
				},
			},
		},
	},
};
