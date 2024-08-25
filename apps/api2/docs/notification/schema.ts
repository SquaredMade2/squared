export const NotificationSchema = {
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "Unique identifier for the notification",
      },
      userId: {
        type: "string",
        description:
          "ID of the user associated with the notification",
      },
      taskIds: {
        type: "array",
        items: { type: "string" },
        description:
          "Array of task IDs associated with the notification",
      },
      read: {
        type: "boolean",
        description:
          "Indicates whether the notification has been read",
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
  }
