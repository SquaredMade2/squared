// Common types
export type DisplayProperty = Record<
	"identifier" | "dueDate" | "avatar" | "labels" | "status" | "priority",
	boolean
>;

// Using const assertions for more type-safe string literal unions
export const TaskOrderOptions = [
	"title",
	"status",
	"priority",
	"assignee",
	"effort",
	"dueDate",
	"updated",
	"created",
] as const;

export type TaskOrder = (typeof TaskOrderOptions)[number];

export const taskGroupOptions = [
	"status",
	"assignee",
	"priority",
	"label",
	// "Parent Task",
] as const;

export type TaskGroup = (typeof taskGroupOptions)[number];

export enum CompletedTaskPeriod {
	All = "All",
	PastDay = "Past day",
	PastWeek = "Past week",
	PastMonth = "Past month",
	None = "None",
}

export type ViewOptions = {
	showEmptyGroups: boolean;
	displayProperties: DisplayProperty;
};

export interface DisplayOptions {
	taskOrder: {
		orderBy: TaskOrder;
		orderAscending: boolean;
	};
	groupTasksBy: TaskGroup;
	groupRowsBy: TaskGroup | "None";
	showCompletedTasks: {
		show: boolean;
		period: CompletedTaskPeriod;
	};
	showSubTasks: boolean;
	viewOptions: {
		listOptions: ViewOptions;
		gridOptions: ViewOptions;
	};
}

export type ViewPath = `/views${string}`;

const LastVisitedPathOptions = [
	"all",
	"active",
	"backlog",
	"sprints/current",
	"inbox",
] as const;
export type LastVisitedPathOption =
	| (typeof LastVisitedPathOptions)[number]
	| ViewPath;

export type View = "list" | "grid";

// State and Actions
export interface ViewState {
	showNavbar: boolean;
	showMobileNavbar: boolean;
	displayOptions: DisplayOptions;
	lastVisitedPage: LastVisitedPathOption;
	view: View;
}

interface ViewActions {
	setView: (view: View) => void;
	getListOptions: () => ViewOptions;
	getGridOptions: () => ViewOptions;
	setShowNavbar: (input: boolean) => void;
	setShowMobileNavbar: (input: boolean) => void;
	setDisplayOptions: (input: Partial<DisplayOptions>) => void;
	setViewOptions: (input: ViewOptions) => void;
	setLastVisitedPage: (input: LastVisitedPathOption) => void;
}

export type ViewStore = ViewState & ViewActions;
