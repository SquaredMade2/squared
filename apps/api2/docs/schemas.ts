import { TaskSchema } from "./task/schema";
import { TeamSchema } from "./team/schema";
import {
  ActivitySchema,
  CommitSchema,
  TaskEventSchema,
  TaskEventLogSchema,
} from "./activity/schema";

const schemas = {
  Task: TaskSchema,
  Team: TeamSchema,
  Activity: ActivitySchema,
  Commit: CommitSchema,
  TaskEvent: TaskEventSchema,
  TaskEventLog: TaskEventLogSchema,
  User: {
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
      username: {
        type: "string",
        description: "Username of the user",
      },
      email: {
        type: "string",
        description: "Email address of the user",
      },
      password: {
        type: "string",
        description: "Hashed password of the user",
      },
      verified: {
        type: "boolean",
        description: "Indicates whether the user's email is verified",
      },
      lastLogin: {
        type: "string",
        format: "date-time",
        description: "The last login time of the user",
      },
      onBoarding: {
        type: "boolean",
        description: "Indicates whether the user has completed onboarding",
      },
      defaultWorkspaceId: {
        type: "string",
        description: "ID of the user's default workspace",
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
      name: {
        type: "string",
        description: "Name of the workspace",
      },
      url: {
        type: "string",
        description: "URL of the workspace",
      },
      companySize: {
        type: "integer",
        description: "Size of the company associated with the workspace",
      },
      issuesCreated: {
        type: "integer",
        description: "Number of issues created in the workspace",
      },
      universalTokenLinkId: {
        type: "string",
        description:
          "ID of the universal token link associated with the workspace",
      },
      githubRepoInfoId: {
        type: "string",
        description:
          "ID of the GitHub repository info associated with the workspace",
      },
    },
  },
  Comment: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "Unique identifier for the comment",
      },
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
      taskIds: {
        type: "array",
        items: { type: "string" },
        description: "Array of task IDs associated with the notification",
      },
      read: {
        type: "boolean",
        description: "Indicates whether the notification has been read",
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
  },
  PageFilterModel: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "Unique identifier for the page filter model",
      },
      filterTitle: {
        type: "string",
        description: "Title of the filter",
      },
      filterOption: {
        type: "object",
        description: "Options used in the filter",
      },
      filterDescription: {
        type: "string",
        description: "Description of the filter",
      },
      teamId: {
        type: "string",
        description: "ID of the team associated with the filter",
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
      owner: {
        type: "string",
        description: "Owner of the GitHub repository",
      },
    },
  },
  Project: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "Unique identifier for the project",
      },
      name: {
        type: "string",
        description: "Name of the project",
      },
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
};

export default schemas;
