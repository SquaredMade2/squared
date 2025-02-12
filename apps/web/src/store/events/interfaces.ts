import type { GetNotificationsResponse } from "@/gen/rpc/event";
import type { Commit, TaskEvent } from "@squared/db";

export type EventState = {
	events: (TaskEvent | Commit)[];
	notifications: GetNotificationsResponse;
	commits: (TaskEvent | Commit)[];
};

type EventActions = {
	setNotifications: (notifications: GetNotificationsResponse) => void;
	setEvents: (events: (TaskEvent | Commit)[]) => void;
	setCommits: (commits: (TaskEvent | Commit)[]) => void;
};

export type EventStore = EventState & EventActions;
