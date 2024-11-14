import { createStore } from "zustand/vanilla";
import type { TaskState, TaskStore } from "./interfaces";
export * from "./interfaces";
export * from "./store";

export const createTaskStore = (
	initState: TaskState = { tasks: [], currentTask: null },
) => {
	return createStore<TaskStore>()((set) => ({
		...initState,
		setCurrentTask: (task) => set({ currentTask: task }),
		setTasks: (tasks) => set({ tasks }),
		createTask: (task) =>
			set((state) => ({
				tasks: [...state.tasks, task],
			})),
		updateTask: (task) =>
			set((state) => ({
				tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
			})),
	}));
};
