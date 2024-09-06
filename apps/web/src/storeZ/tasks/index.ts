import { createStore } from "zustand/vanilla";
import axios from "axios";
import type { TaskState, TaskStore } from "./interfaces";
import { v4 as uuidv4 } from "uuid";
import type { Task } from "@repo/db";
import { persist } from "zustand/middleware";
export * from "./interfaces";
export * from "./store";

const apiString = (path: string) =>
	`${process.env.NEXT_PUBLIC_SERVERZ}/api/task/${path}`;

export const createTaskStore = (initState: TaskState = { tasks: [] }) => {
	return createStore<TaskStore>()(
		persist(
			(set, get) => ({
				...initState,
				addTask: async (task) => {
					const response = await axios.post(apiString(uuidv4()), task);
					const { tasks } = get();
					set({ tasks: [...tasks, response.data] });
					return response.data;
				},
				updateTask: async (taskId, task) => {
					const response = await axios.put(apiString(taskId), task);
					const { tasks } = get();
					set({
						tasks: tasks.map((t) => (t.id === taskId ? response.data : t)),
					});
					return response.data;
				},
				deleteTask: async (taskId) => {
					await axios.delete(apiString(taskId));
					const { tasks } = get();
					set({ tasks: tasks.filter((t) => t.id !== taskId) });
				},
				setTaskList: (tasks) => {
					set({ tasks });
				},
				getTask: async (taskId) => {
					const { tasks } = get();
					const existing = tasks.find((t) => t.id === taskId);
					if (existing) return existing;
					const response = await axios.get(apiString(taskId));
					return response.data;
				},
				getAllTasks: async (teamId) => {
					const response: { data: Task[] } = await axios.get(
						`${process.env.NEXT_PUBLIC_SERVERZ}/api/team/${teamId}/task`,
					);
					set({ tasks: response.data });
					return response.data;
				},
			}),
			{
				name: "task-store",
				getStorage: () => sessionStorage,
			},
		),
	);
};
