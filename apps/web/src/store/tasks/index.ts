import { createStore } from "zustand/vanilla";
import type { TaskState, TaskStore } from "./interfaces";

export type { TaskResponse, TaskState, TaskStore } from "./interfaces";
export { TaskStoreProvider, useTaskStore } from "./store";

export const createTaskStore = (
	initState: TaskState = {
		allBlockedTaskIds: [],
		currentTask: null,
		currentTaskBlockedBy: [],
		currentTaskBlockingIds: [],
		subtasks: [],
		tasks: [],
	},
) => {
	return createStore<TaskStore>()((set) => ({
		...initState,
		createTask: (task) =>
			set((state) => ({
				tasks: [...state.tasks, task],
			})),
		deleteTask: (taskId) =>
			set((state) => ({
				currentTask:
					state.currentTask?.id === taskId ? null : state.currentTask,
				subtasks: state.subtasks.filter((t) => t.id !== taskId),
				tasks: state.tasks.filter((t) => t.id !== taskId),
			})),
		setAllBlockedTaskIds: (ids) => set({ allBlockedTaskIds: ids }),
		setCurrentTask: (task) => set({ currentTask: task }),
		setCurrentTaskBlockedBy: (tasks) => set({ currentTaskBlockedBy: tasks }),
		setCurrentTaskBlockingIds: (ids) => set({ currentTaskBlockingIds: ids }),
		setSubtasks: (subtasks) => set({ subtasks }),
		setTasks: (tasks) => set({ tasks }),
		updateTask: (task) =>
			set((state) => ({
				currentTask:
					task.id === state.currentTask?.id ? task : state.currentTask,
				subtasks: state.subtasks.map((t) => (t.id === task.id ? task : t)),
				tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
			})),
	}));
};
