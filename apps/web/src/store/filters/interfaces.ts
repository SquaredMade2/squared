import type { Task, SavedFilter as SavedFilterType } from "@repo/db";

export type FilterValue =
	| string
	| number
	| Date
	| boolean
	| null
	| (string | null)[]
	| string[];

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

export type SavedFilter = Omit<SavedFilterType, "filter"> & {
	filter: FilterCondition[];
};

export type FilterState = {
	currentFilters: FilterCondition[];
	currentFilterTypes: string[];
	savedFilters: SavedFilter[];
	showSaveForm: boolean;
};

export interface FilterResponse {
	filter: FilterCondition[] | null;
	message?: string;
	variant: "default" | "destructive";
}

type FilterActions = {
	setCurrentFilter: (filter: FilterCondition[]) => void;
	setShowSaveForm: (input: boolean) => void;
	addFilter: (filter: FilterCondition) => void;
	clearFilter: () => void;
	removeFilter: (field: string) => void;
	saveFilter: (filter: Partial<SavedFilter>) => Promise<FilterResponse>;
	getSavedFilters: (groupId: string) => Promise<SavedFilter[]>;
	updateSavedFilter: (
		filterId: string,
		filter: Partial<SavedFilter>,
	) => Promise<FilterResponse>;
	deleteSavedFilter: (filterId: string) => Promise<void>;
	filterTasks: (tasks: Task[]) => Task[];
	customFilter: (tasks: Task[], filter: FilterCondition[]) => Task[];
};

export type FilterStore = FilterState & FilterActions;
