export const WorkspaceSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      description: "Unique identifier for the workspace",
    },
    name: {
      type: "string",
      description: "Name of the workspace",
    },
    url: {
      type: "string",
      description: "URL of the workspace",
    },
    companySize: {
      type: "number",
      description: "Size of the company associated with the workspace",
    },
    issuesCreated: {
      type: "number",
      description: "Number of issues created in the workspace",
    },
    universalTokenLinkId: {
      type: "string",
      description: "ID of the universal token link associated with the workspace",
    },
    githubRepoInfoId: {
      type: "string",
      description: "ID of the GitHub repository info associated with the workspace",
    },
  },
};