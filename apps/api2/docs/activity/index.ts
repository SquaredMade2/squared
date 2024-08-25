const activityDocs = {
  "/api/activity/{taskId}": {
    get: {
      tags: ["Activity"],
      summary: "Retrieve all activities for a specific task",
      description: "Find and return all activities associated with a specific task ID.",
      parameters: [
        {
          in: "path",
          name: "taskId",
          schema: {
            type: "string",
          },
          required: true,
          description: "The ID of the task whose activities are to be retrieved",
        },
      ],
      responses: {
        200: {
          description: "An array of activity objects",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Activity",
                },
              },
            },
          },
        },
        404: {
          description: "Task or activities not found",
        },
        500: {
          description: "Internal server error",
        },
      },
    },
    post: {
      tags: ["Activity"],
      summary: "Create a new activity for a specific task",
      description: "Create a new activity (either a commit or task event) associated with a specific task ID.",
      parameters: [
        {
          in: "path",
          name: "taskId",
          schema: {
            type: "string",
          },
          required: true,
          description: "The ID of the task to which the activity belongs",
        },
      ],
      requestBody: {
        description: "The data for the new activity",
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  enum: ["TASK_EVENT", "COMMIT"],
                  description: "The type of activity to create",
                },
                event: {
                  type: "object",
                  description: "The event data for the activity",
                },
                author: {
                  type: "string",
                  description: "The author of the activity",
                },
              },
              required: ["type", "event", "author"],
            },
          },
        },
      },
      responses: {
        201: {
          description: "The newly created activity object",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Activity",
              },
            },
          },
        },
        400: {
          description: "Invalid activity type or missing data",
        },
        404: {
          description: "Task not found",
        },
        500: {
          description: "Internal server error",
        },
      },
    },
  },
};

export default activityDocs;
export { ActivitySchema, TaskEventSchema, CommitSchema, TaskEventLogSchema } from "./schema"
