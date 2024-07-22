import type { CurrentWorkspace, Team, Workspace, Access, Task } from './taskData.interfaces';

export enum ActionType {
  CREATE_NEW_TASK = 'CREATE_NEW_TASK',
  SET_TASKLIST = 'SET_TASKLIST',
  SET_TASK = 'SET_TASK',
  DELETE_ALL_TASKS = 'DELETE_ALL_TASKS',
  GET_TASKS_ERROR = 'GET_TASKS_ERROR',
  SET_WORKSPACE = 'SET_WORKSPACE',
  GET_WORKSPACE_SUCCESS = 'GET_WORKSPACE_SUCCESS',
  GET_WORKSPACE_FAILURE = 'GET_WORKSPACE_FAILURE',
  SET_CURRENTTEAM = 'SET_CURRENTTEAM',
  GET_TEAM_FAILURE = 'GET_TEAM_FAILURE',
  GET_TEAM_SUCCESS = 'GET_TEAM_SUCCESS',
  SET_ACCESS_ID = 'SET_ACCESS_ID',
  SET_STATUS = 'SET_STATUS',
  SET_PRIORITY = 'SET_PRIORITY',
  SET_LABELS = 'SET_LABELS',
  SET_DUE_DATE = 'SET_DUE_DATE',
  SET_EFFORT_ESTIMATE = 'SET_EFFORT_ESTIMATE',
  INCREMENT_WORKSPACE_ISSUES = 'INCREMENT_WORKSPACE_ISSUES',
}

interface CreateNewTask {
  type: ActionType.CREATE_NEW_TASK;
  payload: Task;
}

interface SetTaskList {
  type: ActionType.SET_TASKLIST;
  payload: Task[];
}

interface SetTask {
  type: ActionType.SET_TASK;
  payload: Task;
}

interface DeleteAllTasks {
  type: ActionType.DELETE_ALL_TASKS;
}

interface GetTasksError {
  type: ActionType.GET_TASKS_ERROR;
}

interface SetWorkspace {
  type: ActionType.SET_WORKSPACE;
  payload: Workspace[];
}
interface IncrementWorkspaceIssues {
  type: ActionType.INCREMENT_WORKSPACE_ISSUES;
}

interface GetWorkspaceSuccess {
  type: ActionType.GET_WORKSPACE_SUCCESS;
  payload: CurrentWorkspace;
}

interface GetWorkspaceFailure {
  type: ActionType.GET_WORKSPACE_FAILURE;
}

interface SetCurrentTeam {
  type: ActionType.SET_CURRENTTEAM;
  payload: Team;
}

interface GetTeamFailure {
  type: ActionType.GET_TEAM_FAILURE;
}

interface GetTeamSuccess {
  type: ActionType.GET_TEAM_SUCCESS;
}

interface SetAccessID {
  type: ActionType.SET_ACCESS_ID;
  payload: Access;
}

interface SetStatus {
  type: ActionType.SET_STATUS;
  payload: string;
}

interface SetPriority {
  type: ActionType.SET_PRIORITY;
  payload: string | null;
}

interface SetLabels {
  type: ActionType.SET_LABELS;
  payload: Array<string>;
}

interface SetDueDate {
  type: ActionType.SET_DUE_DATE;
  payload: Date | null;
}

interface SetEffortEstimate {
  type: ActionType.SET_EFFORT_ESTIMATE;
  payload: number | null;
}

export type Action =
  | CreateNewTask
  | SetTaskList
  | SetTask
  | DeleteAllTasks
  | GetTasksError
  | SetWorkspace
  | GetWorkspaceSuccess
  | GetWorkspaceFailure
  | SetCurrentTeam
  | GetTeamFailure
  | GetTeamSuccess
  | SetAccessID
  | SetPriority
  | SetLabels
  | SetStatus
  | SetDueDate
  | SetEffortEstimate
  | IncrementWorkspaceIssues;
