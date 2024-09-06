import { createStore } from "zustand/vanilla";
import axios from "axios";
import type { ActivityState, ActivityStore, ActivityType } from "./interfaces";
import { persist } from "zustand/middleware";
export * from "./interfaces";
export * from "./store";

const apiString = (path: string) =>
	`${process.env.NEXT_PUBLIC_SERVERZ}/api/activity/${path}`;

export const createActivityStore = (
	initState: ActivityState = { events: [] },
) => {
	return createStore<ActivityStore>()(
		persist(
			(set, get) => ({
				...initState,
				addTaskEvent: async (event, taskId, author) => {
					const response: { data: ActivityType } = await axios.post(
						apiString(taskId),
						{ ...event, type: "TASK_EVENT", author },
					);
					const { events } = get();
					set({ events: [...events, response.data] });
					return response.data.taskEvent;
				},
				addCommitEvent: async (event, taskId, author) => {
					const response: { data: ActivityType } = await axios.post(
						apiString(taskId),
						{
							event,
							type: "COMMIT",
							author,
						},
					);
					const { events } = get();
					set({ events: [...events, response.data] });
					return response.data.commit;
				},
				getTaskEvents: async (taskId) => {
					const response: { data: ActivityType[] } = await axios.get(
						apiString(taskId),
					);
					set({ events: response.data });
					return response.data;
				},
			}),
			{
				name: "activity-store",
				getStorage: () => sessionStorage,
			},
		),
	);
};
