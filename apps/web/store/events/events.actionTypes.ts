import type { Comment } from '@/components/Comments/Comments.interfaces';
import type { TaskEventLog, TaskEvent } from '@/interfaces/event.interfaces';

export enum ActionType {
  UPDATE_COMMENTS = 'UPDATE_COMMENTS',
  COMMENT_IS_LOADING = 'COMMENT_IS_LOADING',
  GET_TASK_COMMENTS = 'GET_TASK_COMMENTS',
  GET_COMMENT_ERROR = 'GET_COMMENT_ERROR',
  UPDATE_COMMENT = 'UPDATE_COMMENT',
  DELETE_COMMENT = 'DELETE_COMMENT',
  CLEAR_TASKPAGE_COMMENTS = 'CLEAR_TASKPAGE_COMMENTS',
  CREATE_TASK_EVENT_LOG = 'CREATE_TASK_EVENT_LOG',
  ADD_TASK_EVENT = 'ADD_TASK_EVENT',
  GET_TASK_EVENT_LOG = 'GET_TASK_EVENT_LOG',
  GET_TASK_EVENTS = 'GET_TASK_EVENTS',
  CLEAR_TASK_EVENT_LOG = 'CLEAR_TASK_EVENT_LOG',
}

interface UpdateComments {
  type: ActionType.UPDATE_COMMENTS;
  payload: Comment;
}

interface GetTaskComments {
  type: ActionType.GET_TASK_COMMENTS;
  payload: Comment[];
}

interface CommentIsLoading {
  type: ActionType.COMMENT_IS_LOADING;
  payload: boolean;
}

interface GetCommentError {
  type: ActionType.GET_COMMENT_ERROR;
  payload: boolean;
}

interface UpdateComment {
  type: ActionType.UPDATE_COMMENT;
  payload: Comment;
}
interface DeleteComment {
  type: ActionType.DELETE_COMMENT;
  payload: string;
}

interface ClearTaskPageComments {
  type: ActionType.CLEAR_TASKPAGE_COMMENTS;
  payload: [];
}

interface CreateTaskEventLog {
  type: ActionType.CREATE_TASK_EVENT_LOG;
  payload: TaskEventLog;
}

interface AddTaskEvent {
  type: ActionType.ADD_TASK_EVENT;
  payload: TaskEvent[];
}

interface GetTaskEventLog {
  type: ActionType.GET_TASK_EVENT_LOG;
  payload: TaskEventLog;
}

interface GetTaskEvents {
  type: ActionType.GET_TASK_EVENTS;
  payload: TaskEvent[];
}

interface ClearTaskEventLog {
  type: ActionType.CLEAR_TASK_EVENT_LOG;
  payload: TaskEventLog;
}

export type Action =
  | UpdateComments
  | GetTaskComments
  | CommentIsLoading
  | GetCommentError
  | UpdateComment
  | DeleteComment
  | ClearTaskPageComments
  | CreateTaskEventLog
  | AddTaskEvent
  | GetTaskEventLog
  | GetTaskEvents
  | ClearTaskEventLog;
