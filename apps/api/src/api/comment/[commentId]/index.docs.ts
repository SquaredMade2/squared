export default {
	"/api/comment/{commentId}": {
		get: {
			tags: ["Comment"],
			summary: "Retrieve a specific comment by ID",
			description: "Find and return a comment by its unique ID.",
			parameters: [
				{
					in: "path",
					name: "commentId",
					schema: {
						type: "string",
					},
					required: true,
					description: "The ID of the comment to retrieve",
				},
			],
			responses: {
				200: {
					description: "A comment object",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/Comment",
							},
						},
					},
				},
				404: {
					description: "Comment not found",
				},
				500: {
					description: "Internal server error",
				},
			},
		},
		put: {
			tags: ["Comment"],
			summary: "Update a specific comment by ID",
			description: "Update a comment's information by its unique ID.",
			parameters: [
				{
					in: "path",
					name: "commentId",
					schema: {
						type: "string",
					},
					required: true,
					description: "The ID of the comment to update",
				},
			],
			requestBody: {
				description: "The updated comment data",
				required: true,
				content: {
					"application/json": {
						schema: {
							$ref: "#/components/schemas/Comment",
						},
					},
				},
			},
			responses: {
				200: {
					description: "The updated comment object",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/Comment",
							},
						},
					},
				},
				404: {
					description: "Comment not found",
				},
				500: {
					description: "Internal server error",
				},
			},
		},
		post: {
			tags: ["Comment"],
			summary: "Create a new comment",
			description:
				"Create a new comment with a given ID. If a comment with the provided ID already exists, an error will be returned.",
			parameters: [
				{
					in: "path",
					name: "commentId",
					schema: {
						type: "string",
					},
					required: true,
					description: "The ID of the new comment",
				},
			],
			requestBody: {
				description: "The data for the new comment",
				required: true,
				content: {
					"application/json": {
						schema: {
							$ref: "#/components/schemas/Comment",
						},
					},
				},
			},
			responses: {
				201: {
					description: "The newly created comment object",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/Comment",
							},
						},
					},
				},
				400: {
					description: "Comment already exists",
				},
				500: {
					description: "Internal server error",
				},
			},
		},
		delete: {
			tags: ["Comment"],
			summary: "Delete a specific comment by ID",
			description:
				"Delete a comment by its unique ID. If the comment does not exist, an error will be returned.",
			parameters: [
				{
					in: "path",
					name: "commentId",
					schema: {
						type: "string",
					},
					required: true,
					description: "The ID of the comment to delete",
				},
			],
			responses: {
				200: {
					description: "Success message indicating the comment was deleted",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									message: {
										type: "string",
										example: "Comment deleted",
									},
								},
							},
						},
					},
				},
				404: {
					description: "Comment not found",
				},
				500: {
					description: "Internal server error",
				},
			},
		},
	},
};
