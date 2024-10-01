export type DisplayProperty = {
	identifier: boolean;
	dueDate: boolean;
	avatar: boolean;
	labels: boolean;
	status: boolean;
	priority: boolean;
};

export type TaskOrder =
	| "Title"
	| "Status"
	| "Priority"
	| "Assignee"
	| "Effort"
	| "Due Date"
	| "Updated"
	| "Created";

export type CompletedTaskPeriod =
	| "All"
	| "Past day"
	| "Past week"
	| "Past month"
	| "None";

type ViewOptions = {
	showEmptyGroups: boolean;
	taskOrder: { orderBy: TaskOrder; orderAscending: boolean };
	showCompletedTasks: { show: boolean; period: CompletedTaskPeriod };
	displayProperties: DisplayProperty;
};

export type ViewState = {
	showNavbar: boolean;
	showMobileNavbar: boolean;
	listViewOptions: ViewOptions;
	gridViewOptions: ViewOptions;
	view: "list" | "grid";
};

type ViewActions = {
	setView: (view: "list" | "grid") => void;
	setShowNavbar: (input: boolean) => void;
	setShowMobileNavbar: (input: boolean) => void;
	setListViewOptions: (input: Partial<ViewOptions>) => void;
	setGridViewOptions: (input: Partial<ViewOptions>) => void;
};

export type ViewStore = ViewState & ViewActions;
