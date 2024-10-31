export default {
	"/api/auth/reset-password": {
		post: {
			tags: ["Authentication"],
			summary: "Request password reset",
			description:
				"Sends a password reset email to the user if their email exists.",
			requestBody: {
				required: true,
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								email: {
									type: "string",
									example: "user@example.com",
									description:
										"The user's email to send the reset password link to.",
								},
							},
							required: ["email"],
						},
					},
				},
			},
			responses: {
				200: {
					description: "Password reset email sent",
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
					description: "Email not found",
				},
				500: {
					description: "Internal server error",
				},
			},
		},
	},
};
