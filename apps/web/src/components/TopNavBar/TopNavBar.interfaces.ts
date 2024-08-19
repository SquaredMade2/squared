import type { FilterOption } from "@/app/interfaces/Filter.interfaces";

export interface TopNavBarProps {
	activeSelected: boolean;
	backlogSelected: boolean;
	myIssueSelected: boolean;
	filterOption: FilterOption | null;
	showFilterSaveForm: boolean;
	showNavBar: boolean;
	handleFilterSaveForm: (value: boolean) => void;
	handleFilter: (filterValue: FilterOption | null) => void;
}
