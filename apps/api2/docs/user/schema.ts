export const UserSchema = {
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
  };
  