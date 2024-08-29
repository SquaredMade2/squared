import { TaskSchema } from "./task/schema";
import { TeamSchema } from "./team/schema";
import { WorkspaceSchema } from "./workspace";

const schemas = {
  Task: TaskSchema,
  Team: TeamSchema,
  Workspace: WorkspaceSchema,
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
        description:
          "Indicates whether the user has completed onboarding",
      },
      defaultWorkspaceId: {
        type: "string",
        description: "ID of the user's default workspace",
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
  },
  TaskEventLog: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "Unique identifier for the task event log",
      },
      authorId: {
        type: "string",
        description: "ID of the author who created the log",
      },
      authorName: {
        type: "string",
        description: "Name of the author who created the log",
      },
      createdAt: {
        type: "string",
        format: "date-time",
        description: "Date when the task event log was created",
      },
      taskId: {
        type: "string",
        description: "ID of the task associated with the event log",
      },
    },
  },
  TaskEvent: {
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
        description: "ID of the author who created the event",
      },
      authorName: {
        type: "string",
        description: "Name of the author who created the event",
      },
      taskId: {
        type: "string",
        description: "ID of the task associated with the event",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
        description: "Date when the task event was last updated",
      },
      originalLabels: {
        type: "array",
        items: { type: "string" },
        description: "Original labels before the event",
      },
      updatedLabels: {
        type: "array",
        items: { type: "string" },
        description: "Updated labels after the event",
      },
      originalValue: {
        type: "string",
        description: "Original value before the event",
      },
      updatedValue: {
        type: "string",
        description: "Updated value after the event",
      },
      originalAssigneeId: {
        type: "string",
        description: "ID of the original assignee before the event",
      },
      originalAssigneeName: {
        type: "string",
        description: "Name of the original assignee before the event",
      },
      updatedAssigneeId: {
        type: "string",
        description: "ID of the updated assignee after the event",
      },
      updatedAssigneeName: {
        type: "string",
        description: "Name of the updated assignee after the event",
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
        description:
          "ID of the workspace associated with the project",
      },
    },
  },
  Commit: {
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
        description: "Timestamp of the commit",
      },
      url: {
        type: "string",
        description: "URL of the commit",
      },
      authorName: {
        type: "string",
        description: "Name of the commit author",
      },
      authorEmail: {
        type: "string",
        description: "Email of the commit author",
      },
      authorUsername: {
        type: "string",
        description: "Username of the commit author",
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
        items: { type: "string" },
        description: "Files added in the commit",
      },
      removed: {
        type: "array",
        items: { type: "string" },
        description: "Files removed in the commit",
      },
      modified: {
        type: "array",
        items: { type: "string" },
        description: "Files modified in the commit",
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
  },
};

export default schemas;
