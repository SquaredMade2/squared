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
		state.tasks.push(response.data);
		return response.data;
	},
	updateTask: (taskId, task, workspaceId, teamId) => async (state) => {
		const response = await axios.put(
			apiString(taskId, workspaceId, teamId),
			task,
		);
		const index = state.tasks.findIndex((t) => t.id === taskId);
		state.tasks[index] = response.data;
		return response.data;
	},
	deleteTask: (taskId, workspaceId, teamId) => async (state) => {
		await axios.delete(apiString(taskId, workspaceId, teamId));
		state.tasks = state.tasks.filter((t) => t.id !== taskId);
	},
	getTask: (taskId, workspaceId, teamId) => async (state) => {
		const existing = state.tasks.find((t) => t.id === taskId);
		const response =
			existing && (await axios.get(apiString(taskId, workspaceId, teamId)));
		return existing ?? response?.data;
	},
	getAllTasks: (workspaceId, teamId) => async (state) => {
		const response = await axios.get(apiString("task", workspaceId, teamId));
		state.tasks = response.data;
		return response.data;
	},
};

export const taskState: TaskState = {
	tasks: [],
};

export const initTaskState: TaskStore = {
	...taskState,
	...taskActions,
};
