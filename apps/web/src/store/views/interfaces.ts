export type DisplayProperty = {
	identifier: boolean;
	dueDate: boolean;
	avatar: boolean;
	labels: boolean;
	status: boolean;
	priority: boolean;
};

export type ViewOptions = {
	showEmptyGroups: boolean;
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
