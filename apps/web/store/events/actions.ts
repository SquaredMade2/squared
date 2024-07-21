import axios, { type AxiosResponse } from "axios";
import type { Dispatch } from "redux";
import type {
  Comment,
  NewComment,
} from "@/components/Comments/Comments.interfaces";
import type {
  Author,
  TaskEvent,
  TaskEventLog,
} from "@/interfaces/event.interfaces";
import {
  type Action,
  ActionType,
} from "@/store/events/events.actionTypes";

// Leave in for clarity
// note the difference with UPDATE_COMMENTS and UPDATE_COMMENT
// UPDATE_COMMENTS adds a newly created comment to the existing array of comments for the task
// UPDATE_COMMENT alters an existing comment
export const UPDATE_COMMENTS = "UPDATE_COMMENTS";
export const GET_TASK_COMMENTS = "GET_TASK_COMMENTS";
export const COMMENT_IS_LOADING = "COMMENT_IS_LOADING";
export const GET_COMMENT_ERROR = "GET_COMMENT_ERROR";
export const UPDATE_COMMENT = "UPDATE_COMMENT";
export const DELETE_COMMENT = "DELETE_COMMENT";
export const CLEAR_TASKPAGE_COMMENTS = "CLEAR_TASKPAGE_COMMENTS";
export const CREATE_TASK_EVENT_LOG = "CREATE_TASK_EVENT_LOG";
export const ADD_TASK_EVENT = "ADD_TASK_EVENT";
export const GET_TASK_EVENT_LOG = "GET_TASK_EVENT_LOG";
export const GET_TASK_EVENTS = "GET_TASK_EVENTS";
export const CLEAR_TASK_EVENT_LOG = "CLEAR_TASK_EVENT_LOG";

export const createComment =
  (comment: NewComment) =>
  async (dispatch: Dispatch<Action>): Promise<void> => {
    try {
      const response: AxiosResponse<Comment> = await axios({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/event/comment/create`,
        data: comment,
      });
      const { data } = response;
      dispatch({
        type: ActionType.UPDATE_COMMENTS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: ActionType.GET_COMMENT_ERROR,
        payload: true,
      });
    }
  };

export const getTaskComments =
  (taskId: string) => async (dispatch: Dispatch<Action>) => {
    try {
      dispatch({
        type: ActionType.COMMENT_IS_LOADING,
        payload: true,
      });
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/event/comment/read/${taskId}`
      );
      const { data } = response;
      if (data.length) {
        dispatch({
          type: ActionType.GET_TASK_COMMENTS,
          payload: data,
        });
        dispatch({
          type: ActionType.COMMENT_IS_LOADING,
          payload: false,
        });
      } else {
        dispatch({
          type: ActionType.COMMENT_IS_LOADING,
          payload: false,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

export const updateComment =
  (id: string, comment: string) =>
  async (dispatch: Dispatch<Action>) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER}/event/comment/update`,
        {
          _id: id,
          comment: comment,
        }
      );
      const { data } = response;
      dispatch({
        type: ActionType.UPDATE_COMMENT,
        payload: data,
      });
    } catch (error) {
      console.error(error);
    }
  };

export const deleteComment =
  (commentId: string, imageKeys?: string[]) =>
  async (dispatch: Dispatch<Action>) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER}/event/comment/delete/${commentId}`
      );
      dispatch({
        type: ActionType.DELETE_COMMENT,
        payload: commentId,
      });
      if (imageKeys && imageKeys.length > 0) {
        const deleteImagePromises = imageKeys.map((imageKey) => {
          axios.delete(
            `${process.env.NEXT_PUBLIC_SERVER}/uploads/image/delete/${imageKey}`
          );
        });
        await Promise.all(deleteImagePromises);
      }
    } catch (error) {
      console.error(error);
    }
  };

export const createTaskEventLog =
  (taskId: string, author: Author) =>
  async (dispatch: Dispatch<Action>) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/event/create-log`,
        {
          taskId,
          author,
        }
      );

      const { data } = response;
      data.__v = undefined;

      dispatch({
        type: ActionType.CREATE_TASK_EVENT_LOG,
        payload: data,
      });
    } catch (error) {
      console.error(error);
    }
  };

export const addTaskEvent =
  (taskEvent: TaskEvent) => async (dispatch: Dispatch<Action>) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER}/event/add`,
        taskEvent
      );
      const { data } = response;
      dispatch({
        type: ActionType.ADD_TASK_EVENT,
        payload: data,
      });
    } catch (error) {
      console.error(error);
    }
  };

export const getTaskEventLog =
  (taskId: string) => async (dispatch: Dispatch<Action>) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/event/read/log/${taskId}`
      );
      const { data } = response;
      const taskEventLog = data[0];
      dispatch({
        type: ActionType.GET_TASK_EVENT_LOG,
        payload: taskEventLog,
      });
      getTaskEvents(taskId)(dispatch);
    } catch (error) {
      console.error(error);
    }
  };

export const getTaskEvents =
  (taskId: string) =>
  async (dispatch: Dispatch<Action>): Promise<void> => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER}/event/read/events/${taskId}`
      );
      const { data } = response;
      dispatch({
        type: ActionType.GET_TASK_EVENTS,
        payload: data,
      });
    } catch (error) {
      console.error(error);
    }
  };

export const clearTaskEventLog =
  (clearedTaskEventLog: TaskEventLog) =>
  async (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.CLEAR_TASK_EVENT_LOG,
      payload: clearedTaskEventLog,
    });
  };
