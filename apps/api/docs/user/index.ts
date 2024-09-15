const userDocs = {
	"/api/user/{userId}": {
		get: {
			tags: ["User"],
			summary: "Retrieve a specific user by ID",
			description: "Find and return a user by its unique ID.",
			parameters: [
				{
					in: "path",
					name: "userId",
					schema: {
						type: "string",
					},
					required: true,
					description: "The ID of the user to retrieve",
				},
			],
			responses: {
				200: {
					description: "A user object",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/User",
							},
						},
					},
				},
				404: {
					description: "User not found",
				},
				500: {
					description: "Internal server error",
				},
			},
		},
		post: {
			tags: ["User"],
			summary: "Create a new user",
			description:
				"Create a new user with a given ID. If a user with the provided ID already exists, an error will be returned.",
			parameters: [
				{
					in: "path",
					name: "userId",
					schema: {
						type: "string",
					},
					required: true,
					description: "The ID of the new user",
				},
			],
			requestBody: {
				description: "The data for the new user",
				required: true,
				content: {
					"application/json": {
						schema: {
							$ref: "#/components/schemas/User",
						},
					},
				},
			},
			responses: {
				201: {
					description: "The newly created user object",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/User",
							},
						},
					},
				},
				400: {
					description: "User already exists",
				},
				500: {
					description: "Internal server error",
				},
			},
		},
		put: {
			tags: ["User"],
			summary: "Update a specific user by ID",
			description: "Update a user's information by its unique ID.",
			parameters: [
				{
					in: "path",
					name: "userId",
					schema: {
						type: "string",
					},
					required: true,
					description: "The ID of the user to update",
				},
			],
			requestBody: {
				description: "The updated user data",
				required: true,
				content: {
					"application/json": {
						schema: {
							$ref: "#/components/schemas/User",
						},
					},
				},
			},
			responses: {
				200: {
					description: "The updated user object",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/User",
							},
						},
					},
				},
				404: {
					description: "User not found",
				},
				500: {
					description: "Internal server error",
				},
			},
		},
		delete: {
			tags: ["User"],
			summary: "Delete a specific user by ID",
			description:
				"Delete a user by its unique ID. If the user does not exist, an error will be returned.",
			parameters: [
				{
					in: "path",
					name: "userId",
					schema: {
						type: "string",
					},
					required: true,
					description: "The ID of the user to delete",
				},
			],
			responses: {
				200: {
					description: "Success message indicating the user was deleted",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									message: {
										type: "string",
										example: "User deleted",
									},
								},
							},
						},
					},
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
	"/api/workspace/{workspaceId}/user": {
		get: {
			tags: ["User"],
			summary: "Retrieve all users for a specific workspace",
			description:
				"Find and return all users associated with a specific workspace ID.",
			parameters: [
				{
					in: "path",
					name: "workspaceId",
					schema: {
						type: "string",
					},
					required: true,
					description:
						"The ID of the workspace whose users are to be retrieved",
				},
			],
			responses: {
				200: {
					description: "An array of user objects",
					content: {
						"application/json": {
							schema: {
								type: "array",
								items: {
									$ref: "#/components/schemas/User",
								},
							},
						},
					},
				},
				404: {
					description: "Users not found",
				},
				500: {
					description: "Internal server error",
				},
			},
		},
	},
};

export default userDocs;
export { UserSchema } from "./schema";
