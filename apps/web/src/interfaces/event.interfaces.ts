import type { Priority } from "@repo/db";

export enum Status {
	backlog = "backlog",
	todo = "todo",
	inProgress = "inProgress",
	done = "done",
	canceled = "canceled",
	duplicate = "duplicate",
}

export enum Labels {
	bug = "bug",
	feature = "feature",
	improvement = "improvement",
	red = "red",
	test = "test",
}

export enum EventType {
	AssigneeUpdated = "assigneeUpdated",
	LabelsUpdated = "labelsUpdated",
	TitleUpdated = "titleUpdated",
	DescriptionUpdated = "descriptionUpdated",
	CommentUpdated = "commentUpdated",
	StatusUpdated = "statusUpdated",
	PriorityUpdated = "priorityUpdated",
}

export interface Author {
	id: string;
	name: string;
}

export interface Assignee {
	id: string | null;
	name: string | null;
}
