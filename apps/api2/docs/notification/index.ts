const notificationDocs = {
  "/api/notification/{notificationId}": {
    post: {
      tags: ["Notification"],
      summary: "Create a new notification",
      description: "Create a new notification with a specific ID.",
      parameters: [
        {
          in: "path",
          name: "notificationId",
          schema: {
            type: "string",
          },
          required: true,
          description: "The ID of the new notification",
        },
      ],
      requestBody: {
        description: "The data for the new notification",
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Notification",
            },
          },
        },
      },
      responses: {
        201: {
          description: "The newly created notification object",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Notification",
              },
            },
          },
        },
        400: {
          description: "Invalid notification data",
        },
        500: {
          description: "Internal server error",
        },
      },
    },
    delete: {
      tags: ["Notification"],
      summary: "Delete a specific notification by ID",
      description:
        "Delete a notification by its unique ID. If the notification does not exist, an error will be returned.",
      parameters: [
        {
          in: "path",
          name: "notificationId",
          schema: {
            type: "string",
          },
          required: true,
          description: "The ID of the notification to delete",
        },
      ],
      responses: {
        200: {
          description: "Success message indicating the notification was deleted",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Notification deleted",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Notification not found",
        },
        500: {
          description: "Internal server error",
        },
      },
    },
  },
  "/api/user/{userId}/notification": {
    get: {
      tags: ["Notification"],
      summary: "Retrieve all notifications for a specific user",
      description: "Find and return all notifications associated with a specific user ID.",
      parameters: [
        {
          in: "path",
          name: "userId",
          schema: {
            type: "string",
          },
          required: true,
          description: "The ID of the user whose notifications are to be retrieved",
        },
      ],
      responses: {
        200: {
          description: "An array of notification objects",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Notification",
                },
              },
            },
          },
        },
        404: {
          description: "User or notifications not found",
        },
        500: {
          description: "Internal server error",
        },
      },
    },
    delete: {
      tags: ["Notification"],
      summary: "Clear all notifications for a specific user",
      description: "Delete all notifications associated with a specific user ID.",
      parameters: [
        {
          in: "path",
          name: "userId",
          schema: {
            type: "string",
          },
          required: true,
          description: "The ID of the user whose notifications are to be cleared",
        },
      ],
      responses: {
        200: {
          description: "Success message indicating all notifications were cleared",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Notifications cleared",
                  },
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

export default notificationDocs;
export { NotificationSchema } from "./schema";
