import type { Task } from "@repo/db";
import type { TaskActions, TaskState, TaskStore } from "./interfaces";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const apiString = (path: string, workspaceId: string, teamId: string) => {
	return `${process.env.SERVER_URL}/api/workspace/${workspaceId}/${teamId}/${path}`;
};

export const taskActions: TaskActions = {
	addTask: (task, workspaceId, teamId) => async (state) => {
		const response = await axios.post(
			apiString(uuidv4(), workspaceId, teamId),
			task,
		);
		const newTask: Task = response.data;
		return {
			...state,
			tasks: [...state.tasks, newTask],
		};
	},
};

export const taskState: TaskState = {
	tasks: [],
};

export const initTaskState: TaskStore = {
	...taskState,
	...taskActions,
};
