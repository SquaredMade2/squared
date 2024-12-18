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

export type CreateFilterParams = {
	name: string;
	description?: string | null;
	filter: FilterCondition[];
	teamId: string;
	authorId: string;
	sprintId? :string | null
};

export type SavedFilter = Omit<SavedFilterType, "filter"> & {
	filter: FilterCondition[];
};

export interface FilterRpc {
	createFilter: (params: CreateFilterParams) => Promise<SavedFilter>;
	getFilters: ({ teamId }: { teamId: string }) => Promise<SavedFilter[]>;
	updateFilter: (args: {
		filterId: string;
		filters: {
			name?: string;
			description?: string | null;
			filter: FilterCondition[];
		};
	}) => Promise<SavedFilter>;
	deleteFilter: ({ filterId }: { filterId: string }) => Promise<void>;
}
