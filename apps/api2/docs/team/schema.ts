export const TeamSchema = {
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
};
