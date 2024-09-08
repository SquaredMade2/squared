export type ViewsState = {
	showDateTime: boolean;
	showPriority: boolean;
	showLabels: boolean;
	showNavbar: boolean;
	view: "list" | "grid";
};

export type ViewsActions = {
	setView: (view: "list" | "grid") => void;
	setShowNavbar: (input: boolean) => void;
	setShowDateTime: (input: boolean) => void;
	setShowPriority: (input: boolean) => void;
	setShowLabels: (input: boolean) => void;
};

export type ViewsStore = ViewsState & ViewsActions;
