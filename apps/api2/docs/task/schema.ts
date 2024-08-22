export const TaskSchema = {
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
        "canceled",
        "duplicate",
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
  },
};
