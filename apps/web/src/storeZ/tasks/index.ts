import type { Task } from "@/store/taskData/taskData.interfaces";
import type { TaskActions, TaskState, TaskStore } from "./interfaces";

export const taskActions: TaskActions = {
  addTask: (task: Task) => (state: TaskState) => ({
    tasks: [...state.tasks, task],
  }),
};

export const taskState: TaskState = {
  tasks: [],
};

export const initTaskState: TaskStore = {
  ...taskState,
  ...taskActions,
};
