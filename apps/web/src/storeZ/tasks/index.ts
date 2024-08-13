import type { Task } from "@repo/db";
import type { TaskActions, TaskState, TaskStore } from "./interfaces";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const apiString = (path: string) => {
	return `${process.env.SERVER_URL}/api/task/${path}`;
};

export const taskActions: TaskActions = {
	addTask: (task) => async (state) => {
		const response = await axios.post(apiString(uuidv4()), task);
		state.tasks.push(response.data);
		return response.data;
	},
	updateTask: (taskId, task) => async (state) => {
		const response = await axios.put(apiString(taskId), task);
		const index = state.tasks.findIndex((t) => t.id === taskId);
		state.tasks[index] = response.data;
		return response.data;
	},
	deleteTask: (taskId) => async (state) => {
		await axios.delete(apiString(taskId));
		state.tasks = state.tasks.filter((t) => t.id !== taskId);
	},
	getTask: (taskId) => async (state) => {
		const existing = state.tasks.find((t) => t.id === taskId);
		const response = existing && (await axios.get(apiString(taskId)));
		return existing ?? response?.data;
	},
	getAllTasks: (teamId) => async (state) => {
		const response = await axios.get(
			`${process.env.SERVER_URL}/api/team/${teamId}`,
		);
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
