import { createStore } from "zustand/vanilla";
import type { EventState, EventStore } from "./interfaces";

export * from "./interfaces";
export * from "./store";

export const createEventStore = (
	initState: EventState = { events: [], notifications: [], commits: [] },
) => {
	return createStore<EventStore>()((set) => ({
		...initState,
		setNotifications: (notifications) => set({ notifications }),
		setEvents: (events) => set({ events }),
		setCommits: (commits) => set({ commits }),
	}));
};
