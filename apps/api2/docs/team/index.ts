const teamDocs = {
  "/api/team/{teamId}": {
    get: {
      tags: ["Team"],
      summary: "Retrieve a specific team by ID",
      description: "Find and return a team by its unique ID.",
      parameters: [
        {
          in: "path",
          name: "teamId",
          schema: {
            type: "string",
          },
          required: true,
          description: "The ID of the team to retrieve",
        },
      ],
      responses: {
        200: {
          description: "A team object",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Team",
              },
            },
          },
        },
        404: {
          description: "Team not found",
        },
        500: {
          description: "Internal server error",
        },
      },
    },
    post: {
      tags: ["Team"],
      summary: "Create a new team",
      description:
        "Create a new team with a given ID. If a team with the provided ID already exists, an error will be returned.",
      parameters: [
        {
          in: "path",
          name: "teamId",
          schema: {
            type: "string",
          },
          required: true,
          description: "The ID of the new team",
        },
      ],
      requestBody: {
        description: "The data for the new team",
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Team",
            },
          },
        },
      },
      responses: {
        201: {
          description: "The newly created team object",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Team",
              },
            },
          },
        },
        400: {
          description: "Team already exists",
        },
        500: {
          description: "Internal server error",
        },
      },
    },
    put: {
      tags: ["Team"],
      summary: "Update a specific team by ID",
      description: "Update a team's information by its unique ID.",
      parameters: [
        {
          in: "path",
          name: "teamId",
          schema: {
            type: "string",
          },
          required: true,
          description: "The ID of the team to update",
        },
      ],
      requestBody: {
        description: "The updated team data",
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Team",
            },
          },
        },
      },
      responses: {
        200: {
          description: "The updated team object",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Team",
              },
            },
          },
        },
        404: {
          description: "Team not found",
        },
        500: {
          description: "Internal server error",
        },
      },
    },
    delete: {
      tags: ["Team"],
      summary: "Delete a specific team by ID",
      description:
        "Delete a team by its unique ID. If the team does not exist, an error will be returned.",
      parameters: [
        {
          in: "path",
          name: "teamId",
          schema: {
            type: "string",
          },
          required: true,
          description: "The ID of the team to delete",
        },
      ],
      responses: {
        200: {
          description:
            "Success message indicating the team was deleted",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Team deleted",
                  },
                },
              },
            },
          },
        },
        404: {
          description: "Team not found",
        },
        500: {
          description: "Internal server error",
        },
      },
    },
  },
  "/api/workspace/{workspaceId}/team": {
    get: {
      tags: ["Team"],
      summary: "Retrieve all teams for a specific workspace",
      description:
        "Find and return all teams associated with a specific workspace ID.",
      parameters: [
        {
          in: "path",
          name: "workspaceId",
          schema: {
            type: "string",
          },
          required: true,
          description:
            "The ID of the workspace whose teams are to be retrieved",
        },
      ],
      responses: {
        200: {
          description: "An array of team objects",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  $ref: "#/components/schemas/Team",
                },
              },
            },
          },
        },
        404: {
          description: "Teams not found",
        },
        500: {
          description: "Internal server error",
        },
      },
    },
  },
};

export default teamDocs;
export { TeamSchema } from "./schema";
