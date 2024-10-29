export default {
	"/api/notification/{notificationId}": {
		post: {
			tags: ["Notification"],
			summary: "Create a new notification",
			description: "Create a new notification with a specific ID.",
			parameters: [
				{
					in: "path",
					name: "notificationId",
					schema: {
						type: "string",
					},
					required: true,
					description: "The ID of the new notification",
				},
			],
			requestBody: {
				description: "The data for the new notification",
				required: true,
				content: {
					"application/json": {
						schema: {
							$ref: "#/components/schemas/Notification",
						},
					},
				},
			},
			responses: {
				201: {
					description: "The newly created notification object",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/Notification",
							},
						},
					},
				},
				400: {
					description: "Invalid notification data",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									data: {
										type: "null",
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
				500: {
					description: "Internal server error",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									data: {
										type: "null",
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
			},
		},
		delete: {
			tags: ["Notification"],
			summary: "Delete a specific notification by ID",
			description:
				"Delete a notification by its unique ID. If the notification does not exist, an error will be returned.",
			parameters: [
				{
					in: "path",
					name: "notificationId",
					schema: {
						type: "string",
					},
					required: true,
					description: "The ID of the notification to delete",
				},
			],
			responses: {
				200: {
					description:
						"Success message indicating the notification was deleted",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									data: {
										type: "null",
									},
									message: {
										type: "string",
										example: "Notification deleted",
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
					description: "Notification not found",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									data: {
										type: "null",
									},
									message: {
										type: "string",
										example: "Notification not found",
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
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									data: {
										type: "null",
									},
									message: {
										type: "string",
										example: "Internal Server Error",
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
		},
		put: {
			tags: ["Notification"],
			summary: "Update a specific notification by ID",
			description:
				"Update a notification by its unique ID. If the notification does not exist, an error will be returned.",
			parameters: [
				{
					in: "path",
					name: "notificationId",
					schema: {
						type: "string",
					},
					required: true,
					description: "The ID of the notification to be updated",
				},
			],
			responses: {
				200: {
					description: "Object containing the updated notification.",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									data: {
										type: "object",
										$ref: "#/components/schemas/Notification",
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
					description: "Notification not found",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									data: {
										type: "null",
									},
									message: {
										type: "string",
										example: "Notification not found",
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
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									data: {
										type: "null",
									},
									message: {
										type: "string",
										example: "Internal Server Error",
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
		},
	},
};
