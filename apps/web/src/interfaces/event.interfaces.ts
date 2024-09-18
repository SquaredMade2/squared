import type { User, Priority, Status } from "@repo/db";

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
	GitUpdated = "gitUpdated",
	CommentUpdated = "commentUpdated",
	StatusUpdated = "statusUpdated",
	PriorityUpdated = "priorityUpdated",
}
