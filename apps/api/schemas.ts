const schemas = {
	Task: {
		type: "object",
		properties: {
			id: {
				type: "string",
				description: "Unique identifier for the task",
			},
			authorId: {
				type: "string",
				description: "ID of the author who created the task",
			},
			title: {
				type: "string",
				description: "Title of the task",
			},
			description: {
				type: "string",
				description: "Detailed description of the task",
			},
			status: {
				type: "string",
				enum: [
					"backlog",
					"todo",
					"inProgress",
					"done",
					"inReview",
					"canceled",
					"archived",
				],
				description: "Current status of the task",
			},
			identifier: {
				type: "string",
				description: "Unique identifier within the system",
			},
			priority: {
				type: "string",
				enum: ["noPriority", "urgent", "high", "medium", "low"],
				description: "Priority level of the task",
			},
			labels: {
				type: "array",
				items: {
					type: "string",
					enum: ["Bug", "Feature", "Improvement", "Red", "Test"],
				},
				description: "Labels associated with the task",
			},
			dueDate: {
				type: "string",
				format: "date-time",
				description: "Due date for the task",
			},
			effortEstimate: {
				type: "integer",
				description: "Estimated effort required to complete the task",
			},
			teamId: {
				type: "string",
				description: "ID of the team associated with the task",
			},
			dateCreated: {
				type: "string",
				format: "date-time",
				description: "Date when the task was created",
			},
			assigneeId: {
				type: "string",
				description: "ID of the user assigned to the task",
			},
			assigneeName: {
				type: "string",
				description: "Name of the user assigned to the task",
			},
			updatedAt: {
				type: "string",
				format: "date-time",
				description: "Date when the task was last updated",
			},
			deleted: {
				type: "boolean",
				description: "Flag indicating whether the task has been deleted",
			},
		},
	},
	Team: {
		type: "object",
		properties: {
			id: {
				type: "string",
				description: "Unique identifier for the team",
			},
			name: {
				type: "string",
				description: "Name of the team",
			},
			identifier: {
				type: "string",
				description: "Unique identifier within the workspace",
			},
			workspaceId: {
				type: "string",
				description: "ID of the workspace associated with the team",
			},
		},
	},
	Activity: {
		type: "object",
		properties: {
			id: {
				type: "string",
				description: "Unique identifier for the activity",
			},
			createdAt: {
				type: "string",
				format: "date-time",
				description: "Timestamp when the activity was created",
			},
			type: {
				type: "string",
				enum: ["TASK_EVENT", "COMMIT"],
				description: "Type of the activity, either a task event or a commit",
			},
			eventLogId: {
				type: "string",
				description: "ID of the associated TaskEventLog",
			},
			commit: {
				$ref: "#/components/schemas/Commit",
				description:
					"Details of the commit if the activity is of type 'COMMIT'",
			},
			taskEvent: {
				$ref: "#/components/schemas/TaskEvent",
				description:
					"Details of the task event if the activity is of type 'TASK_EVENT'",
			},
		},
	},
	Commit: {
		type: "object",
		properties: {
			id: {
				type: "string",
				description: "Unique identifier for the commit",
			},
			tree_id: {
				type: "string",
				description: "Tree ID associated with the commit",
			},
			distinct: {
				type: "boolean",
				description: "Indicates if the commit is distinct",
			},
			message: {
				type: "string",
				description: "Commit message",
			},
			timestamp: {
				type: "string",
				format: "date-time",
				description: "Timestamp when the commit was made",
			},
			url: {
				type: "string",
				description: "URL of the commit in the repository",
			},
			authorName: {
				type: "string",
				description: "Name of the author who made the commit",
			},
			authorEmail: {
				type: "string",
				description: "Email of the author who made the commit",
			},
			authorUsername: {
				type: "string",
				description: "Username of the author who made the commit",
			},
			committerName: {
				type: "string",
				description: "Name of the committer",
			},
			committerEmail: {
				type: "string",
				description: "Email of the committer",
			},
			committerUsername: {
				type: "string",
				description: "Username of the committer",
			},
			added: {
				type: "array",
				items: {
					type: "string",
				},
				description: "List of files added in the commit",
			},
			removed: {
				type: "array",
				items: {
					type: "string",
				},
				description: "List of files removed in the commit",
			},
			modified: {
				type: "array",
				items: {
					type: "string",
				},
				description: "List of files modified in the commit",
			},
			repoName: {
				type: "string",
				description: "Name of the repository",
			},
			owner: {
				type: "string",
				description: "Owner of the repository",
			},
		},
	},
	TaskEvent: {
		type: "object",
		properties: {
			id: {
				type: "string",
				description: "Unique identifier for the task event",
			},
			type: {
				type: "string",
				description: "Type of the task event",
			},
			authorId: {
				type: "string",
				description: "ID of the author who made the task event",
			},
			authorName: {
				type: "string",
				description: "Name of the author who made the task event",
			},
			createdAt: {
				type: "string",
				format: "date-time",
				description: "Timestamp when the task event was created",
			},
			originalValue: {
				type: "string",
				description: "Original value before the task event occurred",
			},
			updatedValue: {
				type: "string",
				description: "Updated value after the task event occurred",
			},
			originalAssigneeId: {
				type: "string",
				description: "ID of the original assignee before the task event",
			},
			originalAssigneeName: {
				type: "string",
				description: "Name of the original assignee before the task event",
			},
			updatedAssigneeId: {
				type: "string",
				description: "ID of the updated assignee after the task event",
			},
			updatedAssigneeName: {
				type: "string",
				description: "Name of the updated assignee after the task event",
			},
			originalLabels: {
				type: "array",
				items: {
					type: "string",
					enum: ["Bug", "Feature", "Improvement", "Red", "Test"],
				},
				description: "Original labels before the task event",
			},
			updatedLabels: {
				type: "array",
				items: {
					type: "string",
					enum: ["Bug", "Feature", "Improvement", "Red", "Test"],
				},
				description: "Updated labels after the task event",
			},
		},
	},
	TaskEventLog: {
		type: "object",
		properties: {
			id: {
				type: "string",
				description: "Unique identifier for the task event log",
			},
			authorId: {
				type: "string",
				description: "ID of the author who created the task event log",
			},
			authorName: {
				type: "string",
				description: "Name of the author who created the task event log",
			},
			createdAt: {
				type: "string",
				format: "date-time",
				description: "Timestamp when the task event log was created",
			},
			taskId: {
				type: "string",
				description: "ID of the task associated with the event log",
			},
			activities: {
				type: "array",
				items: {
					$ref: "#/components/schemas/Activity",
				},
				description: "List of activities associated with this task event log",
			},
		},
		required: ["id", "authorId", "authorName", "createdAt", "taskId"],
	},
	Workspace: {
		type: "object",
		properties: {
			id: {
				type: "string",
				description: "Unique identifier for the workspace",
			},
			name: {
				type: "string",
				description: "Name of the workspace",
			},
			url: {
				type: "string",
				description: "URL of the workspace",
			},
			companySize: {
				type: "number",
				description: "Size of the company associated with the workspace",
			},
			tasksCreated: {
				type: "number",
				description: "Number of issues created in the workspace",
			},
			universalTokenLinkId: {
				type: "string",
				description:
					"ID of the universal token link associated with the workspace",
			},
		},
	},
	User: {
		type: "object",
		properties: {
			id: {
				type: "string",
				description: "Unique identifier for the user",
			},
			name: {
				type: "string",
				description: "Name of the user",
			},
			identifier: {
				type: "string",
				description: "Unique identifier within the workspace",
			},
			workspaceId: {
				type: "string",
				description: "ID of the workspace associated with the user",
			},
		},
	},
	Comment: {
		type: "object",
		properties: {
			id: {
				type: "string",
				description: "Unique identifier for the comment",
			},
			comment: {
				type: "string",
				description: "The text content of the comment",
			},
			authorId: {
				type: "string",
				description: "ID of the author who wrote the comment",
			},
			date: {
				type: "string",
				format: "date-time",
				description: "Date when the comment was created",
			},
			taskId: {
				type: "string",
				description: "ID of the task associated with the comment",
			},
		},
	},
	Notification: {
		type: "object",
		properties: {
			id: {
				type: "string",
				description: "Unique identifier for the notification",
			},
			userId: {
				type: "string",
				description: "ID of the user associated with the notification",
			},
			taskIds: {
				type: "array",
				items: { type: "string" },
				description: "Array of task IDs associated with the notification",
			},
			read: {
				type: "boolean",
				description: "Indicates whether the notification has been read",
			},
			description: {
				type: "string",
				description: "Description of the notification",
			},
			createdAt: {
				type: "string",
				format: "date-time",
				description: "Date when the notification was created",
			},
			updatedAt: {
				type: "string",
				format: "date-time",
				description: "Date when the notification was last updated",
			},
		},
	},
	PageFilterModel: {
		type: "object",
		properties: {
			id: {
				type: "string",
				description: "Unique identifier for the page filter model",
			},
			filterTitle: {
				type: "string",
				description: "Title of the filter",
			},
			filterOption: {
				type: "object",
				description: "Options used in the filter",
			},
			filterDescription: {
				type: "string",
				description: "Description of the filter",
			},
			teamId: {
				type: "string",
				description: "ID of the team associated with the filter",
			},
		},
	},
	UniversalTokenLink: {
		type: "object",
		properties: {
			id: {
				type: "string",
				description: "Unique identifier for the universal token link",
			},
			token: {
				type: "string",
				description: "Token associated with the universal link",
			},
			isEnabled: {
				type: "boolean",
				description: "Indicates whether the token link is enabled",
			},
		},
	},
	GithubRepoInfo: {
		type: "object",
		properties: {
			id: {
				type: "string",
				description: "Unique identifier for the GitHub repo info",
			},
			repoName: {
				type: "string",
				description: "Name of the GitHub repository",
			},
			owner: {
				type: "string",
				description: "Owner of the GitHub repository",
			},
		},
	},
	Project: {
		type: "object",
		properties: {
			id: {
				type: "string",
				description: "Unique identifier for the project",
			},
			name: {
				type: "string",
				description: "Name of the project",
			},
			teamId: {
				type: "string",
				description: "ID of the team associated with the project",
			},
			workspaceId: {
				type: "string",
				description: "ID of the workspace associated with the project",
			},
		},
	},
};

export default schemas;
