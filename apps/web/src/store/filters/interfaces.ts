import type { SavedFilter as SavedFilterType, Task } from "@squared/db";

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
		| "arrayIncludesAny";
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
	saveFilter: (filter: SavedFilter) => void;
	setSavedFilters: (filters: SavedFilter[]) => void;
	updateSavedFilter: (filter: SavedFilter) => void;
	deleteSavedFilter: (filterId: string) => void;
	filterTasks: (tasks: Task[]) => Task[];
	customFilter: (tasks: Task[], filter: FilterCondition[]) => Task[];
	mergeFilters: (
		newFilters: FilterCondition[],
		savedFilterId: string,
	) => FilterCondition[];
};

export type FilterStore = FilterState & FilterActions;
