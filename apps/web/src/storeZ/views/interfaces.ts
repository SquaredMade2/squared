import type { Task } from "@repo/db";

export type ViewsState = {
	currentFilter: Partial<Task> | null;
	showDateTime: boolean;
	showPriority: boolean;
	showLabels: boolean;
};

export type ViewsActions = {
	setCurrentFilter: (filter: Partial<Task>) => (state: ViewsState) => void;
	updateCurrentFilter: (filter: Partial<Task>) => (state: ViewsState) => void;
	removeFilter: () => () => void;
	getCurrentFilter: () => Partial<Task> | null;
	setShowDateTime: (input: boolean) => () => void;
	setShowPriority: (input: boolean) => () => void;
	setShowLabels: (input: boolean) => () => void;
};

export type ViewsStore = ViewsState & ViewsActions;
