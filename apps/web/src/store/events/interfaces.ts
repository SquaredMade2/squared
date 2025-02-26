import type { GetNotificationsResponse } from "@/gen/rpc/event";
import type { GithubCommit, TaskEvent } from "@squared/db";

export type EventState = {
	events: (TaskEvent | GithubCommit)[];
	notifications: GetNotificationsResponse;
	commits: (TaskEvent | GithubCommit)[];
};

type EventActions = {
	setNotifications: (notifications: GetNotificationsResponse) => void;
	setEvents: (events: (TaskEvent | GithubCommit)[]) => void;
	setCommits: (commits: (TaskEvent | GithubCommit)[]) => void;
};

export type EventStore = EventState & EventActions;
