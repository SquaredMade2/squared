import { createStore } from "zustand/vanilla";
import type { TaskState, TaskStore } from "./interfaces";
export * from "./interfaces";
export * from "./store";

export const createTaskStore = (
	initState: TaskState = { tasks: [], subtasks: [], currentTask: null },
) => {
	return createStore<TaskStore>()((set) => ({
		...initState,
		setCurrentTask: (task) => set({ currentTask: task }),
		setTasks: (tasks) => set({ tasks }),
		setSubtasks: (subtasks) => set({ subtasks }),
		createTask: (task) =>
			set((state) => ({
				tasks: [...state.tasks, task],
			})),
		updateTask: (task) =>
			set((state) => ({
				tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
				subtasks: state.subtasks.map((t) => (t.id === task.id ? task : t)),
				currentTask:
					task.id === state.currentTask?.id ? task : state.currentTask,
			})),
		deleteTask: (taskId) =>
			set((state) => ({
				tasks: state.tasks.filter((t) => t.id !== taskId),
				subtasks: state.subtasks.filter((t) => t.id !== taskId),
				currentTask:
					state.currentTask?.id === taskId ? null : state.currentTask,
			})),
	}));
};
