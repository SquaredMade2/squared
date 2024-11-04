import { persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";
import type { TaskState, TaskStore } from "./interfaces";
export * from "./interfaces";
export * from "./store";

export const createTaskStore = (
	initState: TaskState = { tasks: [], currentTask: null },
) => {
	return createStore<TaskStore>()(
		persist(
			(set) => ({
				...initState,
				setCurrentTask: (task) => set({ currentTask: task }),
				setTasks: (tasks) => set({ tasks }),
			}),
			{
				name: "task-store",
				storage: {
					getItem: (name) => {
						const storedValue = sessionStorage.getItem(name);
						return storedValue ? JSON.parse(storedValue) : null;
					},
					setItem: (name, value) => {
						sessionStorage.setItem(name, JSON.stringify(value));
					},
					removeItem: (name) => {
						sessionStorage.removeItem(name);
					},
				},
			},
		),
	);
};
