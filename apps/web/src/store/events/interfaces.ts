import type { GetNotificationsResponse } from "@/gen/rpc/event";
import type { TaskEvent } from "@squared/db";

export type EventState = {
	events: TaskEvent[];
	notifications: GetNotificationsResponse;
	commits: TaskEvent[];
};

type EventActions = {
	setNotifications: (notifications: GetNotificationsResponse) => void;
	setEvents: (events: TaskEvent[]) => void;
	setCommits: (commits: TaskEvent[]) => void;
};

export type EventStore = EventState & EventActions;
