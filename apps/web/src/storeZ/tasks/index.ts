import { createStore } from "zustand/vanilla";
import axios from "axios";
import type { Task } from "@repo/db";

export type TaskState = {
  tasks: Task[];
};

export type TaskActions = {
  addTask: (task: Task) => Promise<void>;
  updateTask: (taskId: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  getTask: (taskId: string) => Promise<Task | undefined>;
  getAllTasks: (teamId: string) => Promise<void>;
};

export type TaskStore = TaskState & TaskActions;

const apiString = (path: string) =>
  `${process.env.SERVER_URL}/api/task/${path}`;

export const createTaskStore = (
  initState: TaskState = { tasks: [] }
) => {
  return createStore<TaskStore>()((set) => ({
    ...initState,
    addTask: async (task) => {
      const response = await axios.post(apiString(""), task);
      set((state) => ({ tasks: [...state.tasks, response.data] }));
    },
    updateTask: async (taskId, task) => {
      const response = await axios.put(apiString(taskId), task);
      set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === taskId ? response.data : t
        ),
      }));
    },
    deleteTask: async (taskId) => {
      await axios.delete(apiString(taskId));
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== taskId),
      }));
    },
    getTask: async (taskId) => {
      const existing = initState.tasks.find((t) => t.id === taskId);
      if (existing) return existing;
      const response = await axios.get(apiString(taskId));
      return response.data;
    },
    getAllTasks: async (teamId) => {
      const response = await axios.get(
        `${process.env.SERVER_URL}/api/team/${teamId}`
      );
      set({ tasks: response.data });
    },
  }));
};
