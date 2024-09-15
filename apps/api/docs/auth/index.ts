const AuthDocs = {
	"/api/auth/": {
		post: {
			tags: ["Authentication"],
			summary: "register, login, and logout a user",
			description:
				"passing in a type of authentication needs as a 'type' field in the body and the server will process the request accordingly. Also send the verification email when needed",
			requestBody: {
				description: "The data for the User",
				required: true,
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								type: {
									type: "string",
									enum: ["register", "login", "logout"],
									description: "The type of authentication needed",
								},
								name: {
									type: "string",
									description: "the name of the user",
								},
								email: {
									type: "string",
									description: "the email of the user, should be unique",
								},
								password: {
									type: "string",
									description:
										"the password for the user, should be greater than 6 characters",
								},
								username: {
									type: "string",
									description: "the username for the user",
								},
							},
							required: ["type", "email", "password"],
						},
					},
				},
			},
			responses: {
				200: {
					description: "successfully logged user in or out",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/User",
							},
						},
					},
				},
				201: {
					description: "successfully registered and created a new User",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/User",
							},
						},
					},
				},
				400: {
					description: "Invalid authentication type or missing data",
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

export default AuthDocs;
