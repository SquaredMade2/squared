import type { Label, Task } from "@repo/db";

type FilterValue = string | number | Date | boolean | null;

export type FilterCondition = {
	field: keyof Task;
	value: FilterValue | Label[];
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

export type ViewsState = {
	currentFilter: TaskFilter | null;
	showDateTime: boolean;
	showPriority: boolean;
	showLabels: boolean;
	showNavbar: boolean;
	view: "list" | "grid";
};

export type ViewsActions = {
	setCurrentFilter: (filter: TaskFilter) => void;
	addFilter: (filter: FilterCondition) => void;
	removeFilter: () => void;
	filterTasks: (tasks: Task[], filter: TaskFilter) => Task[];
	setView: (view: "list" | "grid") => void;
	getCurrentFilter: () => Partial<Task> | null;
	setShowNavbar: (input: boolean) => void;
	setShowDateTime: (input: boolean) => void;
	setShowPriority: (input: boolean) => void;
	setShowLabels: (input: boolean) => void;
};

export type ViewsStore = ViewsState & ViewsActions;
