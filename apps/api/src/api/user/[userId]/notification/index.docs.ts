export default {
	"/api/user/{userId}/notification": {
		get: {
			tags: ["Notification"],
			summary: "Retrieve all notifications for a specific user",
			description:
				"Find and return all notifications associated with a specific user ID.",
			parameters: [
				{
					in: "path",
					name: "userId",
					schema: {
						type: "string",
					},
					required: true,
					description:
						"The ID of the user whose notifications are to be retrieved",
				},
			],
			responses: {
				200: {
					description: "An array of notification objects",
					content: {
						"application/json": {
							schema: {
								type: "array",
								items: {
									$ref: "#/components/schemas/Notification",
								},
							},
						},
					},
				},
				404: {
					description: "User or notifications not found",
				},
				500: {
					description: "Internal server error",
				},
			},
		},
		delete: {
			tags: ["Notification"],
			summary: "Clear all notifications for a specific user",
			description:
				"Delete all notifications associated with a specific user ID.",
			parameters: [
				{
					in: "path",
					name: "userId",
					schema: {
						type: "string",
					},
					required: true,
					description:
						"The ID of the user whose notifications are to be cleared",
				},
			],
			responses: {
				200: {
					description:
						"Success message indicating all notifications were cleared",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									message: {
										type: "string",
										example: "Notifications cleared",
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
