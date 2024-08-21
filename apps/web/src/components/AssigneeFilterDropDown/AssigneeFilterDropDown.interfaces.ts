import type { FilterOption } from "@/app/interfaces/Filter.interfaces";
import type { Dispatch, SetStateAction } from "react";

export interface AssigneeFilterDropDownProps {
	showAssigneeFilterDropDown: boolean;
	setShowAssigneeFilterDropDown: Dispatch<SetStateAction<boolean>>;
	handleFilter: (filterOption: FilterOption) => void;
}
