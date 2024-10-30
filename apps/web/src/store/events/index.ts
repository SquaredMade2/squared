import { createStore } from "zustand/vanilla";
import type { EventState, EventStore } from "./interfaces";

export * from "./interfaces";
export * from "./store";

export const createEventStore = (
	initState: EventState = { events: [], notifications: [], commits: [] },
) => {
	return createStore<EventStore>()(() => ({
		...initState,
		setNotifications: (notifications) => ({ notifications }),
		setEvents: (events) => ({ events }),
		setCommits: (commits) => ({ commits }),
	}));
};
