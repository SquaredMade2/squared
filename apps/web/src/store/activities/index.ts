import { createStore } from "zustand/vanilla";
import axios from "axios";
import type { ActivityState, ActivityStore } from "./interfaces";
import { persist } from "zustand/middleware";
import type { TaskEvent } from "@repo/db";
export * from "./interfaces";
export * from "./store";

const apiString = (path: string) =>
	`${process.env.NEXT_PUBLIC_SERVER}/api/activity/${path}`;

export const createActivityStore = (
	initState: ActivityState = { events: [] },
) => {
	return createStore<ActivityStore>()(
		persist(
			(set, get) => ({
				...initState,
				addTaskEvent: async (event, taskId, authorId) => {
					const response: { data: TaskEvent } = await axios.post(
						apiString(taskId),
						{ ...event, type: "TASK_EVENT", authorId },
					);
					const { events } = get();
					set({ events: [...events, response.data] });
					return response.data;
				},
				addCommitEvent: async (event, taskId, authorId) => {
					const response: { data: TaskEvent } = await axios.post(
						apiString(taskId),
						{
							event,
							type: "COMMIT",
							authorId,
						},
					);
					const { events } = get();
					set({ events: [...events, response.data] });
					return response.data;
				},
				getTaskEvents: async (taskId) => {
					const response = await axios.get(apiString(taskId));
					set({ events: response.data.data });
					return response.data.data;
				},
			}),
			{
				name: "activity-store",
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
