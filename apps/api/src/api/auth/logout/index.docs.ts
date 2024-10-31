export default {
	"/api/auth/logout": {
		post: {
			tags: ["Authentication"],
			summary: "Logs out the user",
			description: "Clears the user's authentication cookie to log them out.",
			responses: {
				200: {
					description: "Logout successful",
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
				500: {
					description: "Internal server error",
				},
			},
		},
	},
};
