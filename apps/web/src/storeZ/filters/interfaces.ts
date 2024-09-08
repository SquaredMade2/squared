import type { Filter, Label, Task } from "@repo/db";

type FilterValue = string | number | Date | boolean | null | Label[];

export type FilterCondition = {
	field: keyof Task;
	value: FilterValue;
	operator:
		| "equals"
		| "contains"
		| "greaterThan"
		| "lessThan"
		| "arrayIncludesAll"
		| "arrayIncludesAny";
};

export type TaskFilter = {
	id?: string;
	logic: "AND" | "OR";
	conditions: FilterCondition[];
};

export type FilterState = {
	currentFilter: TaskFilter | null;
	savedFilters: TaskFilter[];
};

export type FilterResponse = {
	filter: Filter | null;
	message?: string;
	variant: "default" | "destructive";
};

export type FilterActions = {
	setCurrentFilter: (filter: TaskFilter) => void;
	addFilter: (filter: FilterCondition) => void;
	removeFilter: () => void;
	filterTasks: (tasks: Task[], filter: TaskFilter) => Task[];
	saveFilter: (userId: string, filter: TaskFilter) => Promise<FilterResponse>;
	deleteFilter: (filterId: string) => Promise<FilterResponse>;
	getSavedFilters: (userId: string) => Promise<TaskFilter[]>;
};

export type FilterStore = FilterState & FilterActions;
