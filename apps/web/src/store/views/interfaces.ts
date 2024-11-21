// Common types
export type DisplayProperty = Record<
	"identifier" | "dueDate" | "avatar" | "labels" | "status" | "priority",
	boolean
>;

// Using const assertions for more type-safe string literal unions
export const TaskOrderOptions = [
	"Title",
	"Status",
	"Priority",
	"Assignee",
	"Effort",
	"Due Date",
	"Updated",
	"Created",
];
export type TaskOrder = (typeof TaskOrderOptions)[number];

export const TaskGroupOptions = [
	"Status",
	"Assignee",
	"Priority",
	"Label",
	// "Parent Task",
];

export type TaskGroup = (typeof TaskGroupOptions)[number];

export enum CompletedTaskPeriod {
	all = "All",
	pastDay = "Past day",
	pastWeek = "Past week",
	pastMonth = "Past month",
	none = "None",
}

// Grouping related types
export namespace ViewOptions {
	export interface Common {
		showEmptyGroups: boolean;
		displayProperties: DisplayProperty;
	}

	export interface List extends Common {}
	export interface Grid extends Common {}
}

export interface DisplayOptions {
	taskOrder: {
		orderBy: TaskOrder;
		orderAscending: boolean;
	};
	groupTasksBy: TaskGroup;
	showCompletedTasks: {
		show: boolean;
		period: CompletedTaskPeriod;
	};
	showSubTasks: boolean;
	viewOptions: {
		listOptions: ViewOptions.List;
		gridOptions: ViewOptions.Grid;
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
	getListOptions: () => ViewOptions.List;
	getGridOptions: () => ViewOptions.Grid;
	setShowNavbar: (input: boolean) => void;
	setShowMobileNavbar: (input: boolean) => void;
	setListViewOptions: (input: Partial<DisplayOptions>) => void;
	setGridViewOptions: (input: Partial<DisplayOptions>) => void;
	setLastVisitedPage: (input: LastVisitedPathOption) => void;
}

export type ViewStore = ViewState & ViewActions;
