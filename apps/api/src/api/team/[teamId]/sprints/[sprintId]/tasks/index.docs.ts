export default {
	"api/team/{teamId}/sprints/{sprintId}/tasks": {
		get: {
			tags: ["Tasks"],
			summary: "Fetch tasks associated with a specific sprint",
			description:
				"Fetch all tasks linked to the specified sprint ID within a team, if sprints are enabled for that team.",
			parameters: [
				{
					in: "path",
					name: "teamId",
					schema: { type: "string" },
					required: true,
					description: "The ID of the team the sprint belongs to",
				},
				{
					in: "path",
					name: "sprintId",
					schema: { type: "string" },
					required: true,
					description: "The ID of the sprint for which tasks are being fetched",
				},
			],
			responses: {
				200: {
					description: "Array of tasks associated with the sprint",
					content: {
						"application/json": {
							schema: {
								type: "array",
								$ref: "#/components/schemas/Task",
							},
						},
					},
				},
				404: { description: "Team not found" },
				400: { description: "Sprints are not enabled for this team" },
				500: { description: "Internal server error" },
			},
		},
		put: {
			tags: ["Tasks"],
			summary: "Add or remove tasks from a sprint",
			description:
				"Modify tasks in a sprint by adding tasks (with specific statuses) to it, or removing all tasks and marking the sprint as completed.",
			parameters: [
				{
					in: "path",
					name: "teamId",
					schema: { type: "string" },
					required: true,
					description: "The ID of the team the sprint belongs to",
				},
				{
					in: "path",
					name: "sprintId",
					schema: { type: "string" },
					required: true,
					description: "The ID of the sprint to be updated",
				},
			],
			requestBody: {
				description: "Specify whether to add or remove tasks from the sprint",
				required: true,
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								type: {
									type: "string",
									enum: ["add", "remove"],
									description:
										"Operation type: 'add' to assign eligible tasks to sprint, 'remove' to unassign all tasks",
								},
							},
							required: ["type"],
						},
					},
				},
			},
			responses: {
				200: {
					description: "Operation successful; tasks added or removed",
					content: {
						"application/json": {
							schema: { type: "boolean" },
						},
					},
				},
				404: { description: "Team not found" },
				400: { description: "Sprints are not enabled for this team" },
				500: { description: "Internal server error" },
			},
		},
		delete: {
			tags: ["Tasks"],
			summary: "Complete the sprint and unassign unfinished tasks",
			description:
				"End the sprint by marking it as completed and unassigning any tasks that are not yet finished.",
			parameters: [
				{
					in: "path",
					name: "teamId",
					schema: { type: "string" },
					required: true,
					description: "The ID of the team the sprint belongs to",
				},
				{
					in: "path",
					name: "sprintId",
					schema: { type: "string" },
					required: true,
					description: "The ID of the sprint to end",
				},
			],
			responses: {
				200: {
					description: "Sprint successfully completed",
					content: {
						"application/json": {
							schema: { $ref: "#/components/schemas/Sprint" },
						},
					},
				},
				404: { description: "Team not found" },
				400: { description: "Sprints are not enabled for this team" },
				500: { description: "Internal server error" },
			},
		},
	},
};
