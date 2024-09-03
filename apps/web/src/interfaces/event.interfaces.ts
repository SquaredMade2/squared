import type { User, Priority } from "@repo/db";

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

export interface TaskEvent {
	type: "" | EventType;
	author: User;
	taskId: string;
	updatedAt: Date | string | null;
	originalLabels?: Labels[] | [];
	updatedLabels?: Labels[] | [];
	originalValue?: string | Status | Priority | null;
	updatedValue?: string | Status | Priority | null;
	originalAssignee?: User;
	updatedAssignee?: User;
	commentRef?: string;
}
