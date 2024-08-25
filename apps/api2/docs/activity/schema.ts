export const ActivitySchema = {
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
      description: "Details of the commit if the activity is of type 'COMMIT'",
    },
    taskEvent: {
      $ref: "#/components/schemas/TaskEvent",
      description: "Details of the task event if the activity is of type 'TASK_EVENT'",
    },
  },
};

export const CommitSchema = {
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
};

export const TaskEventSchema = {
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
};

export const TaskEventLogSchema = {
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
};

