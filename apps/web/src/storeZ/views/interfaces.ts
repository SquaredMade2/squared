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
		| "arrayIncludesAll"; // Add more operators as needed
};

type TaskFilter = {
	logic: "AND" | "OR";
	conditions: FilterCondition[];
};

export type ViewsState = {
	currentFilter: TaskFilter | null;
	showDateTime: boolean;
	showPriority: boolean;
	showLabels: boolean;
};

export type ViewsActions = {
	setCurrentFilter: (filter: TaskFilter) => void;
	removeFilter: () => void;
	filterTasks: (tasks: Task[], filter: TaskFilter) => Task[];
	getCurrentFilter: () => Partial<Task> | null;
	setShowDateTime: (input: boolean) => void;
	setShowPriority: (input: boolean) => void;
	setShowLabels: (input: boolean) => void;
};

export type ViewsStore = ViewsState & ViewsActions;
