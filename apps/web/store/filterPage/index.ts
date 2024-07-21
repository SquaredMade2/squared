import type { Types } from 'mongoose';
import type { Action } from './actionTypes';
import type { FilterType } from './types';
import {
  GET_FILTERED_VIEWS_PENDING,
  GET_FILTERED_VIEWS_SUCCESS,
  GET_FILTERED_VIEWS_ERROR,
  GET_FILTERED_TASKS_PENDING,
  GET_FILTERED_TASKS_SUCCESS,
  GET_FILTERED_TASKS_ERROR,
  SET_FILTEREDTASKLIST,
  SET_CURRENT_FILTER,
  SET_FILTER_TYPE,
  DELETE_ALL_CURRENT_FILTERS,
  DELETE_SELECTED_FILTER,
  DELETE_VIEW_PENDING,
  DELETE_VIEW_SUCCESS,
  DELETE_VIEW_ERROR,
} from './actions';
import type { Task } from '../taskData/taskData.interfaces';

export interface Filters {
  filterOption: { priority: string[]; status: string[] };
  filterTitle: Types.ObjectId;
  _id: Types.ObjectId;
  teamId: Types.ObjectId;
}

export interface FilteredTaskList {
  description: string;
  labels: string;
  priority: string;
  dueDate: Types.ObjectId;
  effortEstimate: number;
  status: string;
  team: Types.ObjectId;
  title: string;
  _id: Types.ObjectId;
}

export interface DateFilter {
  name: string;
  comparison?: 'before' | 'after';
}

export interface CurrentFilters {
  status: string[];
  priority: string[];
  assignee: string[] | null;
  labels: string[];
  dueDate: DateFilter[];
  effortEstimate: number[];
}

export interface State {
  filters: Filters[];
  filteredTaskList: Task[];
  currentFilters: CurrentFilters;
  filterType: FilterType;
  loading: boolean;
  error: boolean;
}

const initialState: State = {
  filters: [], // future todo: change name to views
  filteredTaskList: [],
  currentFilters: {
    status: [],
    priority: [],
    assignee: [],
    labels: [],
    dueDate: [],
    effortEstimate: [],
  },
  filterType: 'all',
  loading: false,
  error: false,
};

const filterPageReducer = (
  // biome-ignore lint/style/useDefaultParameterLast: <explanation>
  state = initialState,
  action: Action,
): State => {
  switch (action.type) {
    case DELETE_VIEW_PENDING:
      return { ...state, loading: true };
    case DELETE_VIEW_SUCCESS:
      return { ...state, filters: action.payload };
    case DELETE_VIEW_ERROR:
      return { ...state, error: true };
    case DELETE_SELECTED_FILTER:
      return { ...state, currentFilters: action.payload };
    case DELETE_ALL_CURRENT_FILTERS:
      return {
        ...state,
        currentFilters: {
          status: [],
          priority: [],
          assignee: [],
          labels: [],
          dueDate: [],
          effortEstimate: [],
        },
      };
    case SET_CURRENT_FILTER:
      return {
        ...state,
        currentFilters: action.payload,
      };
    case GET_FILTERED_TASKS_PENDING:
      return {
        ...state,
        loading: true,
      };
    case GET_FILTERED_TASKS_SUCCESS:
      return {
        ...state,
        filteredTaskList: action.payload,
        loading: false,
      };
    case GET_FILTERED_TASKS_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
      };
    case GET_FILTERED_VIEWS_PENDING:
      return {
        ...state,
        loading: true,
      };
    case GET_FILTERED_VIEWS_SUCCESS:
      return {
        ...state,
        loading: false,
        filters: action.payload,
      };
    case GET_FILTERED_VIEWS_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
      };
    case SET_FILTEREDTASKLIST:
      return {
        ...state,
        filteredTaskList: action.payload,
      };
    case SET_FILTER_TYPE:
      return {
        ...state,
        filterType: action.payload,
      };
    default:
      return state;
  }
};

export default filterPageReducer;
