import type { Task } from "@repo/db";
import type { ApiReturnType } from "../interfaces";

type FilterValue = string | number | Date | boolean | null | string[];

export type FilterCondition = {
	field: keyof Task;
	value: FilterValue;
	operator:
		| "equals"
		| "contains"
		| "greaterThan"
		| "lessThan"
		| "arrayIncludesAll"
		| "arrayIncludesAny"; // Add more operators as needed
};

export type TaskFilter = {
	logic: "AND" | "OR";
	conditions: FilterCondition[];
};

export type SavedFilter = {
	id: string;
	name: string;
	workspaceId: string;
	filter: TaskFilter;
};

export type ViewsState = {
	currentFilter: TaskFilter | null;
	showDateTime: boolean;
	showPriority: boolean;
	showLabels: boolean;
	showNavbar: boolean;
	view: "list" | "grid";
};

export interface FilterResponse {
	filter: SavedFilter | null;
	message?: string;
	variant: "default" | "destructive";
}

export type ViewsActions = {
	setCurrentFilter: (filter: TaskFilter) => void;
	addFilter: (filter: FilterCondition) => void;
	removeFilter: () => void;
	saveFilter: (filter: SavedFilter) => Promise<FilterResponse>;
	updateSavedFilter: (
		filterId: string,
		filter: Partial<SavedFilter>,
	) => Promise<FilterResponse>;
	deleteSavedFilter: (filterId: string) => Promise<void>;
	filterTasks: (tasks: Task[], filter: TaskFilter) => Task[];
	setView: (view: "list" | "grid") => void;
	setShowNavbar: (input: boolean) => void;
	setShowDateTime: (input: boolean) => void;
	setShowPriority: (input: boolean) => void;
	setShowLabels: (input: boolean) => void;
};

export type ViewsStore = ViewsState & ViewsActions;
