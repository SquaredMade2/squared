export default {
	"/api/filter/{filterId}": {
		get: {
			tags: ["Filter"],
			summary: "Retrieve filters by team or workspace ID",
			description:
				"Find and return saved filters specific to a team or workspace.",
			parameters: [
				{
					in: "path",
					name: "filterId",
					schema: {
						type: "string",
					},
					required: true,
					description:
						"The ID to retrieve saved filters for. Can either be a team ID or a workspace ID.",
				},
			],
			responses: {
				200: {
					description: "An array of saved filters",
					content: {
						"application/json": {
							type: "array",
							schema: {
								$ref: "#/components/schemas/SavedFilter",
							},
						},
					},
				},
				404: {
					description: "Not found",
				},
				500: {
					description: "Internal server error",
				},
			},
		},
		post: {
			tags: ["Filter"],
			summary: "Add a new filter",
			description: "Create a new filter with a specific ID.",
			parameters: [
				{
					in: "path",
					name: "filterId",
					schema: {
						type: "string",
					},
					required: true,
					description: "The ID of the filter to add",
				},
			],
			requestBody: {
				description: "The data for the new filter",
				required: "true",
				content: {
					"application/json": {
						schema: {
							$ref: "#/components/schemas/SavedFilter",
						},
					},
				},
			},
			responses: {
				201: {
					description: "The newly created filter",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/SavedFilter",
							},
						},
					},
				},
				400: {
					description: "Invalid filter data",
				},
				500: {
					description: "Internal server error",
				},
			},
		},
		put: {
			tags: ["Filter"],
			summary: "Update an existing filter by ID",
			description: "Update an existing filter using its ID.",
			parameters: [
				{
					in: "path",
					name: "filterId",
					schema: {
						type: "string",
					},
					required: true,
					description: "The ID of the filter to update",
				},
			],
			requestBody: {
				description: "The updated filter data",
				required: "true",
				content: {
					"application/json": {
						schema: {
							$ref: "#/components/schemas/SavedFilter",
						},
					},
				},
			},
			responses: {
				200: {
					description: "The updated filter object",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/SavedFilter",
							},
						},
					},
				},
				404: {
					description: "Filter not found",
				},
				500: {
					description: "Internal server error",
				},
			},
		},
		delete: {
			tags: ["Filter"],
			summary: "Delete filter by ID",
			description: "Delete a filter using its unique ID.",
			parameters: [
				{
					in: "path",
					name: "filterId",
					schema: {
						type: "string",
					},
					required: true,
					description: "The ID of the filter to delete",
				},
			],
			responses: {
				200: {
					description: "Success message indicating filter was deleted.",
					content: {
						"application/json": {
							type: "object",
							properties: {
								message: {
									type: "string",
									example: "Filter deleted",
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
