import type { Task } from "@/store/taskData/taskData.interfaces";

export type TaskActions = {
  addTask: (task: Task) => (state: TaskState) => TaskState;
};

export type TaskState = {
  tasks: Task[];
};

export type TaskStore = TaskActions & TaskState;
