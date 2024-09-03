import type { Action } from "@/store/events/events.actionTypes";

import {
	UPDATE_COMMENTS,
	GET_TASK_COMMENTS,
	COMMENT_IS_LOADING,
	GET_COMMENT_ERROR,
	DELETE_COMMENT,
	CLEAR_TASKPAGE_COMMENTS,
	CREATE_TASK_EVENT_LOG,
	GET_TASK_EVENT_LOG,
	ADD_TASK_EVENT,
	GET_TASK_EVENTS,
	CLEAR_TASK_EVENT_LOG,
} from "@/store/events/actions";

import type { TaskEvent, TaskEventLog } from "@/interfaces/event.interfaces";
import type { RootState } from "..";
import type { Comment } from "@repo/db";

interface Events extends Comment {
	taskEventLog: TaskEventLog;
	isLoading: boolean;
}

const initialState: Events = {
	taskEventLog: {
		taskId: "",
		author: {
			id: "",
			name: "",
		},
		createdAt: null,
		eventsLog: [],
		_id: "",
	},
	id: "",
	comment: "",
	authorId: "",
	date: new Date(),
	taskId: "",
	isLoading: false,
};

const eventsReducer = (
	// biome-ignore lint/style/useDefaultParameterLast: <explanation>
	state = initialState,
	action: Action,
): Events => {
	switch (action.type) {
		case UPDATE_COMMENTS:
			return {
				...state,
			};
		case GET_TASK_COMMENTS:
			return {
				...state,

				isLoading: false,
			};
		case COMMENT_IS_LOADING:
			return {
				...state,
				isLoading: action.payload,
			};
		case GET_COMMENT_ERROR:
			return {
				...state,
			};
		case DELETE_COMMENT:
			return {
				...state,
			};
		case CLEAR_TASKPAGE_COMMENTS:
			return {
				...state,
			};

		case CREATE_TASK_EVENT_LOG:
			return {
				...state,
				taskEventLog: action.payload,
			};

		case GET_TASK_EVENT_LOG:
			return {
				...state,
				taskEventLog: action.payload,
			};
		case GET_TASK_EVENTS:
			return {
				...state,
				taskEventLog: {
					...state.taskEventLog,
					eventsLog: action.payload,
				},
			};
		case ADD_TASK_EVENT: {
			const updatedEventLog = [
				...state.taskEventLog.eventsLog,
				action.payload,
			] as TaskEvent[];
			return {
				...state,
				taskEventLog: {
					...state.taskEventLog,
					eventsLog: updatedEventLog,
				},
			};
		}
		case CLEAR_TASK_EVENT_LOG:
			return {
				...state,
				taskEventLog: {
					...action.payload,
				},
			};
		default:
			return state;
	}
};

export function hasComment(state: RootState) {
	return !state.events.isLoading;
}

export default eventsReducer;
