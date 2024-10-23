const schemas = {
	Task: {
		type: "object",
		properties: {
			id: { type: "string", description: "Unique identifier for the task" },
			authorId: {
				type: "string",
				description: "ID of the author who created the task",
			},
			title: { type: "string", description: "Title of the task" },
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
					"inReview",
					"done",
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
				items: { type: "string" },
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
			workspaceId: {
				type: "string",
				description: "ID of the workspace associated with the task",
			},
			parentId: {
				type: "string",
				description: "ID of the parent task, if any",
			},
			sprintId: {
				type: "string",
				description: "ID of the sprint associated with the task",
			},
		},
	},
	Team: {
		type: "object",
		properties: {
			id: { type: "string", description: "Unique identifier for the team" },
			name: { type: "string", description: "Name of the team" },
			identifier: {
				type: "string",
				description: "Unique identifier within the workspace",
			},
			workspaceId: {
				type: "string",
				description: "ID of the workspace associated with the team",
			},
			sprintsEnabled: {
				type: "boolean",
				description: "Flag indicating if sprints are enabled for the team",
			},
			sprintDuration: {
				type: "integer",
				description: "Duration of sprints in weeks",
			},
			cooldownDuration: {
				type: "integer",
				description: "Duration of cooldown period in weeks",
			},
			upcomingSprints: {
				type: "integer",
				description: "Number of upcoming sprints",
			},
			activeRequired: {
				type: "boolean",
				description: "Flag indicating if an active sprint is required",
			},
			sprintStartDate: {
				type: "string",
				format: "date-time",
				description: "Start date of the current sprint",
			},
			tasksPerSprint: {
				type: "integer",
				description: "Number of tasks per sprint",
			},
		},
	},
	Activity: {
		type: "object",
		properties: {
			id: { type: "string", description: "Unique identifier for the activity" },
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
			id: { type: "string", description: "Unique identifier for the commit" },
			treeId: {
				type: "string",
				description: "Tree ID associated with the commit",
			},
			distinct: {
				type: "boolean",
				description: "Indicates if the commit is distinct",
			},
			message: { type: "string", description: "Commit message" },
			timestamp: {
				type: "string",
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
			committerName: { type: "string", description: "Name of the committer" },
			committerEmail: { type: "string", description: "Email of the committer" },
			committerUsername: {
				type: "string",
				description: "Username of the committer",
			},
			added: {
				type: "array",
				items: { type: "string" },
				description: "List of files added in the commit",
			},
			removed: {
				type: "array",
				items: { type: "string" },
				description: "List of files removed in the commit",
			},
			modified: {
				type: "array",
				items: { type: "string" },
				description: "List of files modified in the commit",
			},
			repoName: { type: "string", description: "Name of the repository" },
			owner: { type: "string", description: "Owner of the repository" },
			activityId: {
				type: "string",
				description: "ID of the associated activity",
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
			type: { type: "string", description: "Type of the task event" },
			authorId: {
				type: "string",
				description: "ID of the author who made the task event",
			},
			authorName: {
				type: "string",
				description: "Name of the author who made the task event",
			},
			activityId: {
				type: "string",
				description: "ID of the associated activity",
			},
			createdAt: {
				type: "string",
				format: "date-time",
				description: "Timestamp when the task event was created",
			},
			taskId: {
				type: "string",
				description: "ID of the task associated with the event",
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
			gitUpdated: { type: "string", description: "Git update information" },
			originalLabels: {
				type: "array",
				items: { type: "string" },
				description: "Original labels before the task event",
			},
			updatedLabels: {
				type: "array",
				items: { type: "string" },
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
				items: { $ref: "#/components/schemas/Activity" },
				description: "List of activities associated with this task event log",
			},
		},
	},
	Workspace: {
		type: "object",
		properties: {
			id: {
				type: "string",
				description: "Unique identifier for the workspace",
			},
			name: { type: "string", description: "Name of the workspace" },
			url: { type: "string", description: "URL of the workspace" },
			companySize: {
				type: "integer",
				description: "Size of the company associated with the workspace",
			},
			tasksCreated: {
				type: "integer",
				description: "Number of tasks created in the workspace",
			},
			universalTokenLinkId: {
				type: "string",
				description:
					"ID of the universal token link associated with the workspace",
			},
			avatarUrl: { type: "string", description: "URL of the workspace avatar" },
			admins: {
				type: "array",
				items: { type: "string" },
				description: "List of admin user IDs",
			},
		},
	},
	User: {
		type: "object",
		properties: {
			id: { type: "string", description: "Unique identifier for the user" },
			name: { type: "string", description: "Name of the user" },
			username: { type: "string", description: "Username of the user" },
			email: { type: "string", description: "Email of the user" },
			verified: {
				type: "boolean",
				description: "Indicates if the user's email is verified",
			},
			lastLogin: {
				type: "string",
				format: "date-time",
				description: "Timestamp of the user's last login",
			},
			onBoarding: {
				type: "boolean",
				description: "Indicates if the user is in the onboarding process",
			},
			defaultWorkspaceId: {
				type: "string",
				description: "ID of the user's default workspace",
			},
			avatarUrl: { type: "string", description: "URL of the user's avatar" },
			savedNotificationIds: {
				type: "array",
				items: { type: "string" },
				description: "List of saved notification IDs",
			},
			subscribedTasks: {
				type: "array",
				items: { type: "string" },
				description: "List of subscribed task IDs",
			},
			googleId: { type: "string", description: "Google ID for OAuth" },
			githubUsername: { type: "string", description: "GitHub username" },
			githubId: { type: "string", description: "GitHub ID for OAuth" },
		},
	},
	Comment: {
		type: "object",
		properties: {
			id: { type: "string", description: "Unique identifier for the comment" },
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
			taskId: {
				type: "string",
				description: "ID of the task associated with the notification",
			},
			read: {
				type: "boolean",
				description: "Indicates whether the notification has been read",
			},
			saved: {
				type: "boolean",
				description: "Indicates whether the notification has been saved",
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
			workspaceId: {
				type: "string",
				description: "ID of the workspace associated with the notification",
			},
			dismissed: {
				type: "boolean",
				description: "Indicates whether the notification has been dismissed",
			},
			type: {
				type: "string",
				enum: ["ASSIGNED", "PARTICIPATING", "MENTIONED", "CREATED"],
				description: "Type of the notification",
			},
		},
	},
	SavedFilter: {
		type: "object",
		properties: {
			id: {
				type: "string",
				description: "Unique identifier for the saved filter",
			},
			name: { type: "string", description: "Name of the filter" },
			description: { type: "string", description: "Description of the filter" },
			filter: {
				type: "array",
				items: { type: "object" },
				description: "Filter options",
			},
			workspaceId: {
				type: "string",
				description: "ID of the workspace associated with the filter",
			},
			teamId: {
				type: "string",
				description: "ID of the team associated with the filter",
			},
			authorId: {
				type: "string",
				description: "ID of the author who created the filter",
			},
			type: {
				type: "string",
				enum: ["TEAM", "WORKSPACE"],
				description: "Type of the saved filter",
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
			workspaceId: {
				type: "string",
				description: "ID of the workspace associated with the token link",
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
			owner: { type: "string", description: "Owner of the GitHub repository" },
		},
	},
	Project: {
		type: "object",
		properties: {
			id: { type: "string", description: "Unique identifier for the project" },
			name: { type: "string", description: "Name of the project" },
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
	Sprint: {
		type: "object",
		properties: {
			id: { type: "string", description: "Unique identifier for the sprint" },
			name: { type: "string", description: "Name of the sprint" },
			startDate: {
				type: "string",
				format: "date-time",
				description: "Start date of the sprint",
			},
			endDate: {
				type: "string",
				format: "date-time",
				description: "End date of the sprint",
			},
			status: {
				type: "string",
				enum: ["PLANNED", "ACTIVE", "COMPLETED"],
				description: "Status of the sprint",
			},
			teamId: {
				type: "string",
				description: "ID of the team associated with the sprint",
			},
			createdAt: {
				type: "string",
				format: "date-time",
				description: "Date when the sprint was created",
			},
			updatedAt: {
				type: "string",
				format: "date-time",
				description: "Date when the sprint was last updated",
			},
		},
	},
	RetrospectiveItem: {
		type: "object",
		properties: {
			id: {
				type: "string",
				description: "Unique identifier for the retrospective item",
			},
			content: {
				type: "string",
				description: "Content of the retrospective item",
			},
			type: { type: "string", description: "Type of the retrospective item" },
			createdAt: {
				type: "string",
				format: "date-time",
				description: "Date when the item was created",
			},
			updatedAt: {
				type: "string",
				format: "date-time",
				description: "Date when the item was last updated",
			},
		},
	},
};

export default schemas;
