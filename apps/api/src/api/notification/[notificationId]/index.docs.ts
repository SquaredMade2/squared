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
				},
				500: {
					description: "Internal server error",
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
									message: {
										type: "string",
										example: "Notification deleted",
									},
								},
							},
						},
					},
				},
				404: {
					description: "Notification not found",
				},
				500: {
					description: "Internal server error",
				},
			},
		},
	},
};
