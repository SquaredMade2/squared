import type { FilterOption } from "../FilterDropdowns/interfaces";

export interface TopNavBarProps {
	filterOption: FilterOption | null;
	showFilterSaveForm: boolean;
	showNavBar: boolean;
	handleFilterSaveForm: (value: boolean) => void;
	handleFilter: (filterValue: FilterOption | null) => void;
}
