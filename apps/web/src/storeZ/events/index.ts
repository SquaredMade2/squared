import { createStore } from "zustand/vanilla";
import axios from "axios";
import type { ActivityState, ActivityStore, ActivityType } from "./interfaces";
export * from "./interfaces";

const apiString = (path: string) =>
	`${process.env.NEXT_PUBLIC_SERVERZ}/api/activity/${path}`;

export const createActivityStore = (
	initState: ActivityState = { events: [] },
) => {
	return createStore<ActivityStore>()((set) => ({
		...initState,
		addTaskEvent: (event, taskId, author) => async (state) => {
			const response: { data: ActivityType } = await axios.post(
				apiString(taskId),
				{ ...event, type: "TASK_EVENT", author },
			);
			set({ events: [...state.events, response.data] });
			return response.data.taskEvent;
		},
		addCommitEvent: (event, taskId, author) => async (state) => {
			const response: { data: ActivityType } = await axios.post(
				apiString(taskId),
				{
					event,
					type: "COMMIT",
					author,
				},
			);
			set({ events: [...state.events, response.data] });
			return response.data.commit;
		},
		getTaskEvents: (taskId) => async () => {
			const response: { data: ActivityType[] } = await axios.get(
				apiString(taskId),
			);
			set({ events: response.data });
			return response.data;
		},
	}));
};
