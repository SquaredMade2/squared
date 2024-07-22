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

export type TaskEventLog = {
  taskId: string;
  author: Author;
  createdAt: Date | string | null;
  eventsLog: TaskEvent[];
  _id: string;
};

export interface TaskEvent {
  type: "" | EventType;
  author: Author;
  taskId: string;
  updatedAt: Date | string | null;
  originalLabels?: Labels[] | [];
  updatedLabels?: Labels[] | [];
  originalValue?: string | Status | Priority | null;
  updatedValue?: string | Status | Priority | null;
  originalAssignee?: Assignee;
  updatedAssignee?: Assignee;
  commentRef?: string;
}
