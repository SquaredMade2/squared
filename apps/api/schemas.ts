/** biome-ignore-all lint/style/useNamingConvention: These are schema definitions for swagger */
const schemas = {
	Activity: {
		properties: {
			commit: {
				$ref: "#/components/schemas/Commit",
				description:
					"Details of the commit if the activity is of type 'COMMIT'",
			},
			createdAt: {
				description: "Timestamp when the activity was created",
				format: "date-time",
				type: "string",
			},
			eventLogId: {
				description: "ID of the associated TaskEventLog",
				type: "string",
			},
			id: { description: "Unique identifier for the activity", type: "string" },
			taskEvent: {
				$ref: "#/components/schemas/TaskEvent",
				description:
					"Details of the task event if the activity is of type 'TASK_EVENT'",
			},
			type: {
				description: "Type of the activity, either a task event or a commit",
				enum: ["TASK_EVENT", "COMMIT"],
				type: "string",
			},
		},
		type: "object",
	},
	Comment: {
		properties: {
			authorId: {
				description: "ID of the author who wrote the comment",
				type: "string",
			},
			comment: {
				description: "The text content of the comment",
				type: "string",
			},
			date: {
				description: "Date when the comment was created",
				format: "date-time",
				type: "string",
			},
			id: { description: "Unique identifier for the comment", type: "string" },
			taskId: {
				description: "ID of the task associated with the comment",
				type: "string",
			},
		},
		type: "object",
	},
	Commit: {
		properties: {
			activityId: {
				description: "ID of the associated activity",
				type: "string",
			},
			added: {
				description: "List of files added in the commit",
				items: { type: "string" },
				type: "array",
			},
			authorEmail: {
				description: "Email of the author who made the commit",
				type: "string",
			},
			authorName: {
				description: "Name of the author who made the commit",
				type: "string",
			},
			authorUsername: {
				description: "Username of the author who made the commit",
				type: "string",
			},
			committerEmail: { description: "Email of the committer", type: "string" },
			committerName: { description: "Name of the committer", type: "string" },
			committerUsername: {
				description: "Username of the committer",
				type: "string",
			},
			distinct: {
				description: "Indicates if the commit is distinct",
				type: "boolean",
			},
			id: { description: "Unique identifier for the commit", type: "string" },
			message: { description: "Commit message", type: "string" },
			modified: {
				description: "List of files modified in the commit",
				items: { type: "string" },
				type: "array",
			},
			owner: { description: "Owner of the repository", type: "string" },
			removed: {
				description: "List of files removed in the commit",
				items: { type: "string" },
				type: "array",
			},
			repoName: { description: "Name of the repository", type: "string" },
			timestamp: {
				description: "Timestamp when the commit was made",
				type: "string",
			},
			treeId: {
				description: "Tree ID associated with the commit",
				type: "string",
			},
			url: {
				description: "URL of the commit in the repository",
				type: "string",
			},
		},
		type: "object",
	},
	FilterCondition: {
		properties: {
			field: {
				enum: ["status", "priority", "labels", "dueDate", "effort", "assignee"],
				type: "string",
			},
			operator: {
				enum: [
					"equals",
					"contains",
					"greaterThan",
					"lessThan",
					"arrayIncludesAll",
					"arrayIncludesAny",
				],
				type: "string",
			},
			value: {
				anyOf: [
					{ nullable: true, type: "string" },
					{ items: { type: "string" }, type: "array" },
					{ type: "number" },
					{ type: "boolean" },
				],
			},
		},
		type: "object",
	},
	GithubRepoInfo: {
		properties: {
			id: {
				description: "Unique identifier for the GitHub repo info",
				type: "string",
			},
			owner: { description: "Owner of the GitHub repository", type: "string" },
			repoName: {
				description: "Name of the GitHub repository",
				type: "string",
			},
		},
		type: "object",
	},
	InternalServerError: {
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
		type: "object",
	},
	InvalidError: {
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
		type: "object",
	},
	Label: {
		properties: {
			color: {
				description: "Color of the label in hex code.",
				type: "string",
			},
			description: {
				schema: {
					oneOf: {
						with: {
							description: "Description of the label.",
							type: "string",
						},
						without: {
							type: "null",
						},
					},
				},
			},
			id: {
				description: "Unique identifier for the label.",
				type: "string",
			},
			name: {
				description: "Name of the label.",
				type: "string",
			},
			workspaceId: {
				description: "Specific workspace associated with the label.",
				type: "string",
			},
		},
		type: "object",
	},
	Notification: {
		properties: {
			createdAt: {
				description: "Date when the notification was created",
				format: "date-time",
				type: "string",
			},
			description: {
				description: "Description of the notification",
				type: "string",
			},
			dismissed: {
				description: "Indicates whether the notification has been dismissed",
				type: "boolean",
			},
			id: {
				description: "Unique identifier for the notification",
				type: "string",
			},
			read: {
				description: "Indicates whether the notification has been read",
				type: "boolean",
			},
			saved: {
				description: "Indicates whether the notification has been saved",
				type: "boolean",
			},
			taskId: {
				description: "ID of the task associated with the notification",
				type: "string",
			},
			type: {
				description: "Type of the notification",
				enum: ["ASSIGNED", "PARTICIPATING", "MENTIONED", "CREATED"],
				type: "string",
			},
			updatedAt: {
				description: "Date when the notification was last updated",
				format: "date-time",
				type: "string",
			},
			userId: {
				description: "ID of the user associated with the notification",
				type: "string",
			},
			workspaceId: {
				description: "ID of the workspace associated with the notification",
				type: "string",
			},
		},
		type: "object",
	},
	Project: {
		properties: {
			id: { description: "Unique identifier for the project", type: "string" },
			name: { description: "Name of the project", type: "string" },
			teamId: {
				description: "ID of the team associated with the project",
				type: "string",
			},
			workspaceId: {
				description: "ID of the workspace associated with the project",
				type: "string",
			},
		},
		type: "object",
	},
	RetrospectiveItem: {
		properties: {
			content: {
				description: "Content of the retrospective item",
				type: "string",
			},
			createdAt: {
				description: "Date when the item was created",
				format: "date-time",
				type: "string",
			},
			id: {
				description: "Unique identifier for the retrospective item",
				type: "string",
			},
			type: { description: "Type of the retrospective item", type: "string" },
			updatedAt: {
				description: "Date when the item was last updated",
				format: "date-time",
				type: "string",
			},
		},
		type: "object",
	},
	SavedFilter: {
		properties: {
			authorId: {
				description: "ID of the author who created the filter",
				type: "string",
			},
			description: { description: "Description of the filter", type: "string" },
			filter: {
				description: "Filter conditions",
				items: { $ref: "#/components/schemas/FilterCondition" },
				type: "array",
			},
			id: {
				description: "Unique identifier for the saved filter",
				type: "string",
			},
			name: { description: "Name of the filter", type: "string" },
			teamId: {
				description: "ID of the team associated with the filter",
				type: "string",
			},
			type: {
				description: "Type of the saved filter",
				enum: ["TEAM", "WORKSPACE"],
				type: "string",
			},
			workspaceId: {
				description: "ID of the workspace associated with the filter",
				type: "string",
			},
		},
		type: "object",
	},
	Sprint: {
		properties: {
			createdAt: {
				description: "Date when the sprint was created",
				format: "date-time",
				type: "string",
			},
			endDate: {
				description: "End date of the sprint",
				format: "date-time",
				type: "string",
			},
			id: { description: "Unique identifier for the sprint", type: "string" },
			name: { description: "Name of the sprint", type: "string" },
			startDate: {
				description: "Start date of the sprint",
				format: "date-time",
				type: "string",
			},
			status: {
				description: "Status of the sprint",
				enum: ["PLANNED", "ACTIVE", "COMPLETED"],
				type: "string",
			},
			teamId: {
				description: "ID of the team associated with the sprint",
				type: "string",
			},
			updatedAt: {
				description: "Date when the sprint was last updated",
				format: "date-time",
				type: "string",
			},
		},
		type: "object",
	},
	Task: {
		properties: {
			assigneeId: {
				description: "ID of the user assigned to the task",
				type: "string",
			},
			assigneeName: {
				description: "Name of the user assigned to the task",
				type: "string",
			},
			authorId: {
				description: "ID of the author who created the task",
				type: "string",
			},
			dateCreated: {
				description: "Date when the task was created",
				format: "date-time",
				type: "string",
			},
			deleted: {
				description: "Flag indicating whether the task has been deleted",
				type: "boolean",
			},
			description: {
				description: "Detailed description of the task",
				type: "string",
			},
			dueDate: {
				description: "Due date for the task",
				format: "date-time",
				type: "string",
			},
			effortEstimate: {
				description: "Estimated effort required to complete the task",
				type: "integer",
			},
			id: { description: "Unique identifier for the task", type: "string" },
			identifier: {
				description: "Unique identifier within the system",
				type: "string",
			},
			labels: {
				description: "Labels associated with the task",
				items: { type: "string" },
				type: "array",
			},
			parentId: {
				description: "ID of the parent task, if any",
				type: "string",
			},
			priority: {
				description: "Priority level of the task",
				enum: ["noPriority", "urgent", "high", "medium", "low"],
				type: "string",
			},
			sprintId: {
				description: "ID of the sprint associated with the task",
				type: "string",
			},
			status: {
				description: "Current status of the task",
				enum: [
					"backlog",
					"todo",
					"inProgress",
					"inReview",
					"done",
					"canceled",
					"archived",
				],
				type: "string",
			},
			teamId: {
				description: "ID of the team associated with the task",
				type: "string",
			},
			title: { description: "Title of the task", type: "string" },
			updatedAt: {
				description: "Date when the task was last updated",
				format: "date-time",
				type: "string",
			},
			workspaceId: {
				description: "ID of the workspace associated with the task",
				type: "string",
			},
		},
		type: "object",
	},
	TaskEvent: {
		properties: {
			activityId: {
				description: "ID of the associated activity",
				type: "string",
			},
			authorId: {
				description: "ID of the author who made the task event",
				type: "string",
			},
			authorName: {
				description: "Name of the author who made the task event",
				type: "string",
			},
			createdAt: {
				description: "Timestamp when the task event was created",
				format: "date-time",
				type: "string",
			},
			gitUpdated: { description: "Git update information", type: "string" },
			id: {
				description: "Unique identifier for the task event",
				type: "string",
			},
			originalAssigneeId: {
				description: "ID of the original assignee before the task event",
				type: "string",
			},
			originalAssigneeName: {
				description: "Name of the original assignee before the task event",
				type: "string",
			},
			originalLabels: {
				description: "Original labels before the task event",
				items: { type: "string" },
				type: "array",
			},
			originalValue: {
				description: "Original value before the task event occurred",
				type: "string",
			},
			taskId: {
				description: "ID of the task associated with the event",
				type: "string",
			},
			type: { description: "Type of the task event", type: "string" },
			updatedAssigneeId: {
				description: "ID of the updated assignee after the task event",
				type: "string",
			},
			updatedAssigneeName: {
				description: "Name of the updated assignee after the task event",
				type: "string",
			},
			updatedLabels: {
				description: "Updated labels after the task event",
				items: { type: "string" },
				type: "array",
			},
			updatedValue: {
				description: "Updated value after the task event occurred",
				type: "string",
			},
		},
		type: "object",
	},
	TaskEventLog: {
		properties: {
			activities: {
				description: "List of activities associated with this task event log",
				items: { $ref: "#/components/schemas/Activity" },
				type: "array",
			},
			authorId: {
				description: "ID of the author who created the task event log",
				type: "string",
			},
			authorName: {
				description: "Name of the author who created the task event log",
				type: "string",
			},
			createdAt: {
				description: "Timestamp when the task event log was created",
				format: "date-time",
				type: "string",
			},
			id: {
				description: "Unique identifier for the task event log",
				type: "string",
			},
			taskId: {
				description: "ID of the task associated with the event log",
				type: "string",
			},
		},
		type: "object",
	},
	Team: {
		properties: {
			activeRequired: {
				description: "Flag indicating if an active sprint is required",
				type: "boolean",
			},
			cooldownDuration: {
				description: "Duration of cooldown period in weeks",
				type: "integer",
			},
			id: { description: "Unique identifier for the team", type: "string" },
			identifier: {
				description: "Unique identifier within the workspace",
				type: "string",
			},
			name: { description: "Name of the team", type: "string" },
			sprintDuration: {
				description: "Duration of sprints in weeks",
				type: "integer",
			},
			sprintStartDate: {
				description: "Start date of the current sprint",
				format: "date-time",
				type: "string",
			},
			sprintsEnabled: {
				description: "Flag indicating if sprints are enabled for the team",
				type: "boolean",
			},
			tasksPerSprint: {
				description: "Number of tasks per sprint",
				type: "integer",
			},
			upcomingSprints: {
				description: "Number of upcoming sprints",
				type: "integer",
			},
			workspaceId: {
				description: "ID of the workspace associated with the team",
				type: "string",
			},
		},
		type: "object",
	},
	UniversalTokenLink: {
		properties: {
			id: {
				description: "Unique identifier for the universal token link",
				type: "string",
			},
			isEnabled: {
				description: "Indicates whether the token link is enabled",
				type: "boolean",
			},
			token: {
				description: "Token associated with the universal link",
				type: "string",
			},
			workspaceId: {
				description: "ID of the workspace associated with the token link",
				type: "string",
			},
		},
		type: "object",
	},
	User: {
		properties: {
			avatarUrl: { description: "URL of the user's avatar", type: "string" },
			createdAt: {
				description: "Timestamp when the user was created",
				format: "date-time",
				type: "string",
			},
			defaultWorkspaceId: {
				description: "ID of the user's default workspace",
				type: "string",
			},
			email: { description: "Email of the user", type: "string" },
			githubId: { description: "GitHub ID for OAuth", type: "string" },
			githubUsername: { description: "GitHub username", type: "string" },
			googleId: { description: "Google ID for OAuth", type: "string" },
			id: { description: "Unique identifier for the user", type: "string" },
			name: { description: "Name of the user", type: "string" },

			onBoarding: {
				description: "Indicates if the user is in the onboarding process",
				type: "boolean",
			},
			savedNotificationIds: {
				description: "List of saved notification IDs",
				items: { type: "string" },
				type: "array",
			},
			subscribedTasks: {
				description: "List of subscribed task IDs",
				items: { type: "string" },
				type: "array",
			},
			username: { description: "Username of the user", type: "string" },
			verified: {
				description: "Indicates if the user's email is verified",
				type: "boolean",
			},
		},
		type: "object",
	},
	UserAvatar: {
		properties: {
			avatarUrl: {
				schema: {
					oneOf: {
						image: {
							description: "URL of avatar image.",
							type: "string",
						},
						none: {
							type: "null",
						},
					},
				},
			},
			id: {
				description: "Unique identifier for the avatar.",
				type: "string",
			},
			name: {
				description: "Name of the avatar.",
				type: "string",
			},
		},
		type: "object",
	},
	Workspace: {
		properties: {
			admins: {
				description: "List of admin user IDs",
				items: { type: "string" },
				type: "array",
			},
			avatarUrl: { description: "URL of the workspace avatar", type: "string" },
			companySize: {
				description: "Size of the company associated with the workspace",
				type: "integer",
			},
			id: {
				description: "Unique identifier for the workspace",
				type: "string",
			},
			name: { description: "Name of the workspace", type: "string" },
			tasksCreated: {
				description: "Number of tasks created in the workspace",
				type: "integer",
			},
			universalTokenLinkId: {
				description:
					"ID of the universal token link associated with the workspace",
				type: "string",
			},
			url: { description: "URL of the workspace", type: "string" },
		},
		type: "object",
	},
};

export default schemas;
