import type { Task } from "@squared/db";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";
import type { ApiReturnType } from "../interfaces";
import type { TaskResponse, TaskState, TaskStore } from "./interfaces";
export * from "./interfaces";
export * from "./store";

const apiString = (path: string) =>
	`${process.env.NEXT_PUBLIC_SERVER}/api/task/${path}`;

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
						const { currentTask } = get();
						if (currentTask && currentTask.id === taskId) {
							set({ currentTask: updatedTask });
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
						const { data: response }: { data: ApiReturnType<Task> } =
							await axios.get(apiString(taskId));
						const { data: task, ...rest } = response;
						return { ...rest, task };
					} catch (error) {
						return {
							task: null,
							message: error instanceof Error ? error.message : "Unknown error",
							variant: "destructive",
						};
					}
				},
				getTaskByIdentifier: async (
					workspaceId,
					taskIdentifier,
				): Promise<TaskResponse> => {
					try {
						const response: { data: ApiReturnType<Task> } = await axios.get(
							`${process.env.NEXT_PUBLIC_SERVER}/api/workspace/${workspaceId}/task/${taskIdentifier}`,
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
								`${process.env.NEXT_PUBLIC_SERVER}/api/team/${teamId}/task`,
							);
						const { data: tasks } = response;
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
				toggleSprintTasks: async (
					teamId: string,
					sprintId: string,
					type: "add" | "remove",
				): Promise<ApiReturnType<Task[]>> => {
					try {
						const response: { data: ApiReturnType<Task[]> } = await axios.put(
							`${process.env.NEXT_PUBLIC_SERVER}/api/team/${teamId}/sprints/${sprintId}/tasks`,
							{ type },
						);
						const { data: updatedTasks } = response.data;
						if (updatedTasks) {
							set((state) => ({
								tasks: state.tasks.map((task) => {
									const updatedTask = updatedTasks.find(
										(t) => t.id === task.id,
									);
									return updatedTask ? updatedTask : task;
								}),
							}));
						}
						return response.data;
					} catch (error) {
						return {
							data: [],
							message: error instanceof Error ? error.message : "Unknown error",
							variant: "destructive",
						};
					}
				},
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
