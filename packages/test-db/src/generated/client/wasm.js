
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.18.0
 * Query Engine version: 4c784e32044a8a016d99474bd02a3b6123742169
 */
Prisma.prismaVersion = {
  client: "5.18.0",
  engine: "4c784e32044a8a016d99474bd02a3b6123742169"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}

/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.CommitScalarFieldEnum = {
  id: 'id',
  tree_id: 'tree_id',
  distinct: 'distinct',
  message: 'message',
  timestamp: 'timestamp',
  url: 'url',
  authorName: 'authorName',
  authorEmail: 'authorEmail',
  authorUsername: 'authorUsername',
  committerName: 'committerName',
  committerEmail: 'committerEmail',
  committerUsername: 'committerUsername',
  added: 'added',
  removed: 'removed',
  modified: 'modified',
  repoName: 'repoName',
  owner: 'owner'
};

exports.Prisma.TaskEventLogScalarFieldEnum = {
  id: 'id',
  authorId: 'authorId',
  authorName: 'authorName',
  createdAt: 'createdAt',
  taskId: 'taskId'
};

exports.Prisma.TaskEventScalarFieldEnum = {
  id: 'id',
  type: 'type',
  authorId: 'authorId',
  authorName: 'authorName',
  taskId: 'taskId',
  updatedAt: 'updatedAt',
  originalLabels: 'originalLabels',
  updatedLabels: 'updatedLabels',
  originalValue: 'originalValue',
  updatedValue: 'updatedValue',
  originalAssigneeId: 'originalAssigneeId',
  originalAssigneeName: 'originalAssigneeName',
  updatedAssigneeId: 'updatedAssigneeId',
  updatedAssigneeName: 'updatedAssigneeName'
};

exports.Prisma.CommentScalarFieldEnum = {
  id: 'id',
  comment: 'comment',
  authorId: 'authorId',
  date: 'date',
  taskId: 'taskId'
};

exports.Prisma.NotificationScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  taskIds: 'taskIds',
  read: 'read',
  description: 'description',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PageFilterModelScalarFieldEnum = {
  id: 'id',
  filterTitle: 'filterTitle',
  filterOption: 'filterOption',
  filterDescription: 'filterDescription',
  teamId: 'teamId'
};

exports.Prisma.TaskScalarFieldEnum = {
  id: 'id',
  authorId: 'authorId',
  title: 'title',
  description: 'description',
  status: 'status',
  identifier: 'identifier',
  priority: 'priority',
  labels: 'labels',
  dueDate: 'dueDate',
  effortEstimate: 'effortEstimate',
  teamId: 'teamId',
  dateCreated: 'dateCreated',
  assigneeId: 'assigneeId',
  assigneeName: 'assigneeName'
};

exports.Prisma.TeamScalarFieldEnum = {
  id: 'id',
  name: 'name',
  identifier: 'identifier',
  workspaceId: 'workspaceId'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  name: 'name',
  username: 'username',
  email: 'email',
  password: 'password',
  verified: 'verified',
  lastLogin: 'lastLogin',
  onBoarding: 'onBoarding',
  defaultWorkspaceId: 'defaultWorkspaceId'
};

exports.Prisma.WorkspaceScalarFieldEnum = {
  id: 'id',
  name: 'name',
  url: 'url',
  companySize: 'companySize',
  issuesCreated: 'issuesCreated',
  universalTokenLinkId: 'universalTokenLinkId',
  githubRepoInfoId: 'githubRepoInfoId'
};

exports.Prisma.UniversalTokenLinkScalarFieldEnum = {
  id: 'id',
  token: 'token',
  isEnabled: 'isEnabled'
};

exports.Prisma.GithubRepoInfoScalarFieldEnum = {
  id: 'id',
  repoName: 'repoName',
  owner: 'owner'
};

exports.Prisma.ProjectScalarFieldEnum = {
  id: 'id',
  name: 'name',
  teamId: 'teamId',
  workspaceId: 'workspaceId'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.Label = exports.$Enums.Label = {
  Bug: 'Bug',
  Feature: 'Feature',
  Improvement: 'Improvement',
  Red: 'Red',
  Test: 'Test'
};

exports.Status = exports.$Enums.Status = {
  backlog: 'backlog',
  todo: 'todo',
  inProgress: 'inProgress',
  done: 'done',
  canceled: 'canceled',
  duplicate: 'duplicate'
};

exports.Priority = exports.$Enums.Priority = {
  noPriority: 'noPriority',
  urgent: 'urgent',
  high: 'high',
  medium: 'medium',
  low: 'low'
};

exports.Prisma.ModelName = {
  Commit: 'Commit',
  TaskEventLog: 'TaskEventLog',
  TaskEvent: 'TaskEvent',
  Comment: 'Comment',
  Notification: 'Notification',
  PageFilterModel: 'PageFilterModel',
  Task: 'Task',
  Team: 'Team',
  User: 'User',
  Workspace: 'Workspace',
  UniversalTokenLink: 'UniversalTokenLink',
  GithubRepoInfo: 'GithubRepoInfo',
  Project: 'Project'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
