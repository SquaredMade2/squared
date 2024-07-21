import axios from 'axios';
import type { Dispatch } from 'redux';
import { ActionType, type Action } from './actionTypes';
import type { Task } from '../taskData/taskData.interfaces';
import type { FilterType } from './types';
import type { CurrentFilters } from './index';
import type { AppDispatch, RootState } from '..';
import type { FilterOption } from '@/app/interfaces/Filter.interfaces';

export const GET_FILTERED_TASKS_PENDING = 'GET_FILTERED_TASKS_PENDING';
export const GET_FILTERED_TASKS_SUCCESS = 'GET_FILTERED_TASKS_SUCCESS';
export const GET_FILTERED_TASKS_ERROR = 'GET_FILTERED_TASKS_ERROR';
export const GET_FILTERED_VIEWS_PENDING = 'GET_FILTERED_VIEWS_PENDING';
export const GET_FILTERED_VIEWS_SUCCESS = 'GET_FILTERED_VIEWS_SUCCESS';
export const GET_FILTERED_VIEWS_ERROR = 'GET_FILTERED_VIEWS_ERROR';
export const SET_FILTEREDTASKLIST = 'SET_FILTEREDTASKLIST';
export const SET_CURRENT_FILTER = 'SET_CURRENT_FILTER';
export const SET_FILTER_TYPE = 'SET_FILTER_TYPE';
export const DELETE_ALL_CURRENT_FILTERS = 'DELETE_ALL_CURRENT_FILTERS';
export const DELETE_SELECTED_FILTER = 'DELETE_SELECTED_FILTER';
export const DELETE_VIEW_PENDING = 'DELETE_VIEW_PENDING';
export const DELETE_VIEW_SUCCESS = 'DELETE_VIEW_SUCCESS';
export const DELETE_VIEW_ERROR = 'DELETE_VIEW_ERROR';

export const getFilteredViews = (teamId: string) => async (dispatch: Dispatch<Action>) => {
  // get all views/filters associated with the team -- leave comment in for clarity
  dispatch({ type: ActionType.GET_FILTERED_VIEWS_PENDING });

  await axios({
    url: `${process.env.NEXT_PUBLIC_SERVER}/filter/read/${teamId}`,
    method: 'GET',
  })
    .then((response) => {
      dispatch({
        type: ActionType.GET_FILTERED_VIEWS_SUCCESS,
        payload: response.data,
      });
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: ActionType.GET_FILTERED_VIEWS_ERROR,
      });
    });
};

export const getFilteredTasks =
  (teamId: string, filterId: string, dashboardPage: boolean, filterType: FilterType) =>
  async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    // get tasks associated with the filter -- leave comment in for clarity
    dispatch({ type: ActionType.GET_FILTERED_TASKS_PENDING });

    const state = getState();
    const currentFilters = state.filterPage.currentFilters;

    const url = `${process.env.NEXT_PUBLIC_SERVER}/filter/tasks/${teamId}/${filterId}`;
    //get tasks for the main page if dashboardPage is true
    //otherwise get tasks for the filter from the views page -- leave comment in for clarity
    const method = dashboardPage ? 'POST' : 'GET';
    const data = dashboardPage ? { filters: currentFilters, filterType } : undefined;

    console.log('Sending data to server:', { ...currentFilters, filterType });

    await axios({ url, method, data })
      .then((response) => {
        dispatch({
          type: ActionType.GET_FILTERED_TASKS_SUCCESS,
          payload: response.data,
        });
      })
      .catch((err) => {
        console.error(err);
        dispatch({
          type: ActionType.GET_FILTERED_TASKS_ERROR,
        });
      });
  };

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const setFilteredTaskList = (data: Task[]) => ({
  // update filteredTaskList if task is moved to new column -- leave comment in for clarity
  type: ActionType.SET_FILTEREDTASKLIST,
  payload: data,
});

export const setCurrentFilter =
  (filter: FilterOption) => (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const currentFilters = state.filterPage.currentFilters;

    let updatedFilters = { ...currentFilters };

    switch (filter.group) {
      case 'status':
        updatedFilters = {
          ...updatedFilters,
          status: currentFilters.status.includes(filter.name)
            ? currentFilters.status.filter((item) => item !== filter.name)
            : [...currentFilters.status, filter.name],
        };
        break;
      case 'priority':
        updatedFilters = {
          ...updatedFilters,
          priority: currentFilters.priority.includes(filter.name)
            ? currentFilters.priority.filter((item) => item !== filter.name)
            : [...currentFilters.priority, filter.name],
        };
        break;
      case 'assignee':
        updatedFilters = {
          ...updatedFilters,
          assignee: currentFilters.assignee?.includes(filter.name)
            ? currentFilters.assignee.filter((item) => item !== filter.name)
            : [...(currentFilters.assignee || []), filter.name],
        };
        break;
      case 'labels':
        updatedFilters = {
          ...updatedFilters,
          labels: currentFilters.labels.includes(filter.name)
            ? currentFilters.labels.filter((item) => item !== filter.name)
            : [...currentFilters.labels, filter.name],
        };
        break;
      case 'dueDate': {
        const validComparison = filter.comparison as 'before' | 'after' | undefined;
        updatedFilters = {
          ...updatedFilters,
          dueDate: currentFilters.dueDate.some((dateFilter) => dateFilter.name === filter.name)
            ? currentFilters.dueDate.filter((dateFilter) => dateFilter.name !== filter.name)
            : [...currentFilters.dueDate, { name: filter.name, comparison: validComparison }],
        };
        break;
      }
      case 'effortEstimate':
        updatedFilters = {
          ...updatedFilters,
          effortEstimate: currentFilters.effortEstimate.includes(Number(filter.name))
            ? currentFilters.effortEstimate.filter((item) => item !== Number(filter.name))
            : [...currentFilters.effortEstimate, Number(filter.name)],
        };
        break;
      default:
        break;
    }

    dispatch({
      type: SET_CURRENT_FILTER,
      payload: updatedFilters,
    });
  };

export const setFilterType = (filterType: FilterType) => ({
  type: ActionType.SET_FILTER_TYPE,
  payload: filterType,
});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const deleteAllCurrentFilters = () => ({
  type: ActionType.DELETE_ALL_CURRENT_FILTERS,
});

export const deleteSelectedFilter =
  (updatedFilters: CurrentFilters) => (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.DELETE_SELECTED_FILTER,
      payload: updatedFilters,
    });
  };

export const deleteView =
  (filterId: string, teamId: string) => async (dispatch: Dispatch<Action>) => {
    // delete a view in the View page -- leave comment in for clarity
    dispatch({ type: ActionType.DELETE_VIEW_PENDING });
    await axios({
      url: `${process.env.NEXT_PUBLIC_SERVER}/filter/delete/`,
      method: 'DELETE',
      data: {
        filterId,
        teamId,
      },
    })
      .then((response) => {
        dispatch({
          type: ActionType.DELETE_VIEW_SUCCESS,
          payload: response.data,
        });
      })
      .catch((err) => {
        console.log(err);
        dispatch({ type: ActionType.DELETE_VIEW_ERROR });
      });
  };
