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

export type SavedFilter = {
	id: string;
	name: string;
	workspaceId: string;
	filter: FilterCondition[];
};

export type FilterState = {
	currentFilters: FilterCondition[];
};

export interface FilterResponse {
	filter: FilterCondition[] | null;
	message?: string;
	variant: "default" | "destructive";
}

export type FilterActions = {
	setCurrentFilter: (filter: FilterCondition[]) => void;
	addFilter: (filter: FilterCondition) => void;
	clearFilter: () => void;
	removeFilter: (field: keyof Task) => void;
	saveFilter: (filter: SavedFilter) => Promise<FilterResponse>;
	updateSavedFilter: (
		filterId: string,
		filter: Partial<SavedFilter>,
	) => Promise<FilterResponse>;
	deleteSavedFilter: (filterId: string) => Promise<void>;
	filterTasks: (tasks: Task[]) => Task[];
};

export type FilterStore = FilterState & FilterActions;
