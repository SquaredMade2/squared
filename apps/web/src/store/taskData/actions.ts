import { type Action, ActionType } from './taskData.actionTypes';
import type { Team, Workspace, Access, Task } from './taskData.interfaces';

export const CREATE_NEW_TASK = 'CREATE_NEW_TASK';
export const SET_TASKLIST = 'SET_TASKLIST';
export const SET_TASK = 'SET_TASK';
export const DELETE_ALL_TASKS = 'DELETE_ALL_TASKS';
export const GET_TASKS_ERROR = 'GET_TASKS_ERROR';
export const SET_WORKSPACE = 'SET_WORKSPACE';
export const INCREMENT_WORKSPACE_ISSUES = 'INCREMENT_WORKSPACE_ISSUES';
export const GET_WORKSPACE_SUCCESS = 'GET_WORKSPACE_SUCCESS';
export const GET_WORKSPACE_FAILURE = 'GET_WORKSPACE_FAILURE';
export const SET_CURRENTTEAM = 'SET_CURRENTTEAM';
export const GET_TEAM_FAILURE = 'GET_TEAM_FAILURE';
export const GET_TEAM_SUCCESS = 'GET_TEAM_SUCCESS';
export const SET_ACCESS_ID = 'SET_ACCESS_ID';
export const SET_STATUS = 'SET_STATUS';
export const SET_PRIORITY = 'SET_PRIORITY';
export const SET_LABELS = 'SET_LABELS';
export const SET_DUE_DATE = 'SET_DUE_DATE';
export const SET_EFFORT_ESTIMATE = 'SET_EFFORT_ESTIMATE';

export const setTaskList = (data: Task[]): Action => ({
  type: ActionType.SET_TASKLIST,
  payload: data,
});

export const setTaskPage = (task: Task): Action => ({
  type: ActionType.SET_TASK,
  payload: task,
});

export const setStatus = (statusSelected: string): Action => ({
  type: ActionType.SET_STATUS,
  payload: statusSelected,
});

export const setPriority = (prioritySelected: string | null): Action => ({
  type: ActionType.SET_PRIORITY,
  payload: prioritySelected,
});

export const setLabels = (labelsSelected: Array<string>): Action => ({
  type: ActionType.SET_LABELS,
  payload: labelsSelected,
});

export const setDueDate = (dateSelected: Date | null): Action => ({
  type: ActionType.SET_DUE_DATE,
  payload: dateSelected,
});

export const setEffortEstimate = (effortEstimateSelected: number | null): Action => ({
  type: ActionType.SET_EFFORT_ESTIMATE,
  payload: effortEstimateSelected,
});

export const setWorkspace = (data: Workspace[]): Action => ({
  type: ActionType.SET_WORKSPACE,
  payload: data,
});

export const setCurrentTeam = (data: Team): Action => ({
  type: ActionType.SET_CURRENTTEAM,
  payload: data,
});

export const setAccessId = (data: Access): Action => ({
  type: ActionType.SET_ACCESS_ID,
  payload: data,
});
