export default {
	"/api/auth/reset-password/{token}": {
		post: {
			tags: ["Authentication"],
			summary: "Reset the user's password",
			description:
				"Uses a token sent to the user's email to reset their password.",
			parameters: [
				{
					in: "path",
					name: "token",
					schema: {
						type: "string",
					},
					required: true,
					description:
						"The token sent to the user's email for password reset verification.",
				},
			],
			requestBody: {
				required: true,
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								newPassword: {
									type: "string",
									description: "The new password for the user",
								},
							},
							required: ["newPassword"],
						},
					},
				},
			},
			responses: {
				200: {
					description: "Password successfully updated",
					content: {
						"application/json": {
							schema: {
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
				400: {
					description: "Invalid token",
				},
				500: {
					description: "Internal server error",
				},
			},
		},
	},
};
