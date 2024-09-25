export type ViewState = {
	showDateTime: boolean;
	showPriority: boolean;
	showLabels: boolean;
	showNavbar: boolean;
	showMobileNavbar: boolean;
	view: "list" | "grid";
};

type ViewActions = {
	setView: (view: "list" | "grid") => void;
	setShowNavbar: (input: boolean) => void;
	setShowMobileNavbar: (input: boolean) => void;
	setShowDateTime: (input: boolean) => void;
	setShowPriority: (input: boolean) => void;
	setShowLabels: (input: boolean) => void;
};

export type ViewStore = ViewState & ViewActions;
