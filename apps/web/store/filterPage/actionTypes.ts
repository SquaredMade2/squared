import type { Task } from '../taskData/taskData.interfaces';
import type { Filters, CurrentFilters } from './index';
import type { FilterType } from './types';

export enum ActionType {
  GET_FILTERED_TASKS_PENDING = 'GET_FILTERED_TASKS_PENDING',
  GET_FILTERED_TASKS_SUCCESS = 'GET_FILTERED_TASKS_SUCCESS',
  GET_FILTERED_TASKS_ERROR = 'GET_FILTERED_TASKS_ERROR',
  GET_FILTERED_VIEWS_PENDING = 'GET_FILTERED_VIEWS_PENDING',
  GET_FILTERED_VIEWS_SUCCESS = 'GET_FILTERED_VIEWS_SUCCESS',
  GET_FILTERED_VIEWS_ERROR = 'GET_FILTERED_VIEWS_ERROR',
  SET_FILTEREDTASKLIST = 'SET_FILTEREDTASKLIST',
  SET_CURRENT_FILTER = 'SET_CURRENT_FILTER',
  SET_FILTER_TYPE = 'SET_FILTER_TYPE',
  DELETE_ALL_CURRENT_FILTERS = 'DELETE_ALL_CURRENT_FILTERS',
  DELETE_SELECTED_FILTER = 'DELETE_SELECTED_FILTER',
  DELETE_VIEW_PENDING = 'DELETE_VIEW_PENDING',
  DELETE_VIEW_SUCCESS = 'DELETE_VIEW_SUCCESS',
  DELETE_VIEW_ERROR = 'DELETE_VIEW_ERROR',
}

interface DeleteViewError {
  type: ActionType.DELETE_VIEW_ERROR;
}

interface DeleteViewSuccess {
  type: ActionType.DELETE_VIEW_SUCCESS;
  payload: Filters[];
}

interface DeleteViewPending {
  type: ActionType.DELETE_VIEW_PENDING;
}

interface DeleteSelectedFilter {
  type: ActionType.DELETE_SELECTED_FILTER;
  payload: CurrentFilters;
}

interface DeleteAllCurrentFilters {
  type: ActionType.DELETE_ALL_CURRENT_FILTERS;
}

interface SetCurrentFilter {
  type: ActionType.SET_CURRENT_FILTER;
  payload: CurrentFilters;
}

interface SetFilteredTaskList {
  type: ActionType.SET_FILTEREDTASKLIST;
  payload: Task[];
}

interface SetFilterType {
  type: ActionType.SET_FILTER_TYPE;
  payload: FilterType;
}

interface GetFilteredViewsError {
  type: ActionType.GET_FILTERED_VIEWS_ERROR;
}

interface GetFilteredViewsSuccess {
  type: ActionType.GET_FILTERED_VIEWS_SUCCESS;
  payload: Filters[];
}

interface GetFilteredViewsPending {
  type: ActionType.GET_FILTERED_VIEWS_PENDING;
}

interface GetFilteredTasksPending {
  type: ActionType.GET_FILTERED_TASKS_PENDING;
}

interface GetFilteredTasksSuccess {
  type: ActionType.GET_FILTERED_TASKS_SUCCESS;
  payload: Task[];
}

interface GetFilteredTasksError {
  type: ActionType.GET_FILTERED_TASKS_ERROR;
}

export type Action =
  | DeleteViewError
  | DeleteViewSuccess
  | DeleteViewPending
  | DeleteSelectedFilter
  | DeleteAllCurrentFilters
  | SetCurrentFilter
  | SetFilteredTaskList
  | SetFilterType
  | GetFilteredViewsError
  | GetFilteredViewsSuccess
  | GetFilteredViewsPending
  | GetFilteredTasksPending
  | GetFilteredTasksSuccess
  | GetFilteredTasksError;
