import { createStore } from "zustand/vanilla";
import type { EventState, EventStore } from "./interfaces";

export type { EventState, EventStore } from "./interfaces";
export { EventStoreProvider, useEventStore } from "./store";

export const createEventStore = (
	initState: EventState = { commits: [], events: [], notifications: [] },
) => {
	return createStore<EventStore>()((set) => ({
		...initState,
		setCommits: (commits) => set({ commits }),
		setEvents: (events) => set({ events }),
		setNotifications: (notifications) => set({ notifications }),
	}));
};
