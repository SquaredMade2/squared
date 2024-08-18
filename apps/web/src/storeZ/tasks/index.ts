import { createStore } from "zustand/vanilla";
import axios from "axios";
import type { TaskState, TaskStore } from "./interfaces";
import { v4 as uuidv4 } from "uuid";
export * from "./interfaces";

const apiString = (path: string) =>
	`${process.env.SERVER_URL}/api/task/${path}`;

export const createTaskStore = (initState: TaskState = { tasks: [] }) => {
	return createStore<TaskStore>()((set) => ({
		...initState,
		addTask: (task) => async (state) => {
			const response = await axios.post(apiString(uuidv4()), task);
			set({ tasks: [...state.tasks, response.data] });
			return response.data;
		},
		updateTask: (taskId, task) => async (state) => {
			const response = await axios.put(apiString(taskId), task);
			set({
				tasks: state.tasks.map((t) => (t.id === taskId ? response.data : t)),
			});
			return response.data;
		},
		deleteTask: (taskId) => async (state) => {
			await axios.delete(apiString(taskId));
			set({
				tasks: state.tasks.filter((t) => t.id !== taskId),
			});
		},
		getTask: (taskId) => async (state) => {
			const existing = state.tasks.find((t) => t.id === taskId);
			if (existing) return existing;
			const response = await axios.get(apiString(taskId));
			return response.data;
		},
		getAllTasks: (teamId) => async (state) => {
			const response = await axios.get(
				`${process.env.SERVER_URL}/api/team/${teamId}/task`,
			);
			set({ tasks: response.data });
		},
	}));
};
