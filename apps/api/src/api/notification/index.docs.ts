export default {
	"/api/notification": {
		put: {
			tags: ["Notification"],
			summary: "Update an array of notifications.",
			description:
				"Update an array of notifications if update data is present, else delete an array of notifications.",
			requestBody: {
				description:
					"The array of notifications to be updated and the data to be applied to each notification.",
				required: true,
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								notifications: {
									type: "array",
									$ref: "#/components/schemas/Notification",
								},
								data: {
									type: "object",
									$ref: "#/components/schemas/Notification",
								},
							},
						},
					},
				},
			},
			responses: {
				200: {
					description: "Array of updated notifications.",
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
				400: {
					description:
						"Invalid request body. Expected a non-empty array of notifications.",
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
	},
};
