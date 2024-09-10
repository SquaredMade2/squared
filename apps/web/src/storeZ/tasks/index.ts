import { createStore } from "zustand/vanilla";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { persist } from "zustand/middleware";
import type { TaskState, TaskStore, TaskResponse, Task } from "./interfaces";
import type { Task as TaskType, Label } from "@repo/db";
import type { ApiReturnType } from "../interfaces";
export * from "./interfaces";
export * from "./store";

const apiString = (path: string) =>
	`${process.env.NEXT_PUBLIC_SERVERZ}/api/task/${path}`;

export const createTaskStore = (
	initState: TaskState = { tasks: [], currentTask: null },
) => {
	return createStore<TaskStore>()(
		persist(
			(set, get) => ({
				...initState,
				addTask: async (task: Partial<Task>): Promise<TaskResponse> => {
					try {
						const taskId = uuidv4();
						const response: { data: ApiReturnType<Task> } = await axios.post(
							apiString(taskId),
							task,
						);
						const { data: newTask, message, variant } = response.data;

						if (!newTask) {
							return { task: null, message, variant };
						}

						const { tasks } = get();
						set({ tasks: [...tasks, newTask] });

						return { task: newTask, message, variant };
					} catch (error) {
						return {
							task: null,
							message: error instanceof Error ? error.message : "Unknown error",
							variant: "destructive",
						};
					}
				},
				updateTask: async (
					taskId: string,
					task: Partial<Task>,
				): Promise<TaskResponse> => {
					try {
						const response: { data: ApiReturnType<Task> } = await axios.put(
							apiString(taskId),
							task,
						);
						const updatedTask = response.data.data;
						if (!updatedTask) {
							return {
								task: null,
								message: response.data.message,
								variant: response.data.variant,
							};
						}
						set((state) => ({
							tasks: state.tasks.map((t) =>
								t.id === taskId ? updatedTask : t,
							),
						}));

						return {
							task: updatedTask,
							message: response.data.message,
							variant: response.data.variant,
						};
					} catch (error) {
						return {
							task: null,
							message: error instanceof Error ? error.message : "Unknown error",
							variant: "destructive",
						};
					}
				},
				setCurrentTask: (task: Task): void => {
					set({ currentTask: task });
				},
				deleteTask: async (taskId: string): Promise<void> => {
					try {
						await axios.delete(apiString(taskId));
						set((state) => ({
							tasks: state.tasks.filter((t) => t.id !== taskId),
						}));
					} catch (error) {
						console.error("Error in deleteTask:", error);
					}
				},
				setTaskList: (tasks: Task[]): void => {
					set({ tasks });
				},
				getTask: async (taskId: string): Promise<TaskResponse> => {
					const { tasks } = get();
					const existingTask = tasks.find((t) => t.id === taskId);
					if (existingTask) {
						return {
							task: existingTask,
							message: "Task found",
							variant: "default",
						};
					}

					try {
						const response: { data: ApiReturnType<Task> } = await axios.get(
							apiString(taskId),
						);
						return { ...response.data, task: response.data.data };
					} catch (error) {
						return {
							task: null,
							message: error instanceof Error ? error.message : "Unknown error",
							variant: "destructive",
						};
					}
				},
				getAllTasks: async (teamId: string): Promise<Task[]> => {
					try {
						const { data: response }: { data: ApiReturnType<Task[]> } =
							await axios.get(
								`${process.env.NEXT_PUBLIC_SERVERZ}/api/team/${teamId}/task`,
							);
						const { data: tasks, message, variant } = response;
						if (!tasks) {
							set({ tasks: [] });
							return [];
						}
						set({ tasks });
						return tasks;
					} catch (error) {
						console.error("Error in getAllTasks:", error);
						return [];
					}
				},
			}),
			{
				name: "task-store",
				getStorage: () => sessionStorage,
			},
		),
	);
};
