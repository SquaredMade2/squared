import { Types } from "mongoose";

export enum Status {
	backlog = "backlog",
	todo = "todo",
	inProgress = "inProgress",
	done = "done",
	canceled = "canceled",
	duplicate = "duplicate",
}

export enum Priority {
	noPriority = "noPriority",
	urgent = "urgent",
	high = "high",
	medium = "medium",
	low = "low",
}

export enum Labels {
	bug = "Bug",
	feature = "Feature",
	improvement = "Improvement",
	red = "Red",
	test = "Test",
}

export interface Author {
	id: Types.ObjectId;
	name: string;
}

export interface Assignee {
	id: Types.ObjectId | "";
	name: string;
}

export interface TaskEventLog {
	author: Author;
	createdAt: Date;
	eventsLog: [];
	taskId: Types.ObjectId;
}

export interface TaskEvent {
	type:
		| "labelsUpdated"
		| "titleUpdated"
		| "descriptionUpdated"
		| "commentUpdated"
		| "statusUpdated"
		| "priorityUpdated"
		| "assigneeUpdated";
	author: Author;
	taskId: Types.ObjectId;
	updatedAt: Date;
	originalLabels?: Labels[] | null;
	updatedLabels?: Labels[] | null;
	originalValue?: string | Status | Priority | null;
	updatedValue?: string | Status | Priority | null;
	originalAssignee?: Assignee;
	updatedAssignee?: Assignee;
}

export interface Comment {
	comment: String;
	author: Types.ObjectId;
	date: Date;
	task: Types.ObjectId;
}
