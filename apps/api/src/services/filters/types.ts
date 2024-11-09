import type { SavedFilter, Task } from "@squared/db";

// The parent ID for getting saved filters can either be a team's ID or a
// workspaces ID. It is NOT the id of any one individual saved filter.
export type GetFilterParams = {
	parentId: string;
};

// For deleting a filter, the specific ID of the saved filter is used.
export type DeleteFilterParams = {
	filterId: string;
};

type FilterValue = string | number | Date | boolean | null | string[];

type FilterCondition = {
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

type SavedFilterPlusCondition = Omit<SavedFilter, "filter"> & {
	filter: FilterCondition[];
};

export type CreateFilterParams = SavedFilterPlusCondition & {
	filterId: string;
};
export type UpdateFilterParams = SavedFilterPlusCondition;

export interface FilterRpc {
	createFilter: (body: CreateFilterParams) => Promise<SavedFilter>;
	updateFilter: (body: UpdateFilterParams) => Promise<SavedFilter>;
	getFilter: (body: GetFilterParams) => Promise<SavedFilter[]>;
	deleteFilter: (body: DeleteFilterParams) => Promise<SavedFilter>;
}
