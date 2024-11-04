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
								type: "object",
								properties: {
									data: {
										type: "array",
										items: {
											$ref: "#/components/schemas/Notification",
										},
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
					description: "User or notifications not found",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/InvalidError",
							},
						},
					},
				},
				500: {
					description: "Internal server error",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/InternalServerError",
							},
						},
					},
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
									data: {
										type: "null",
									},
									message: {
										type: "string",
										example: "Notifications cleared",
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
								$ref: "#/components/schemas/InternalServerError",
							},
						},
					},
				},
			},
		},
	},
};
