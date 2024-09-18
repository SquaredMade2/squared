export type FilterOption = {
	id: number;
	name: string;
	svg: JSX.Element;
	group: string;
};

import type { Dispatch, SetStateAction } from "react";

export interface EffortFilterDropDownProps {
	showEffortFilterDropDown: boolean;
	setShowEffortFilterDropDown: Dispatch<SetStateAction<boolean>>;
}

export interface StatusFilterDropDownProps {
	showStatusFilterDropDown: boolean;
	setShowStatusFilterDropDown: Dispatch<SetStateAction<boolean>>;
}

export interface LabelFilterDropDownProps {
	showLabelFilterDropDown: boolean;
	setShowLabelFilterDropDown: Dispatch<SetStateAction<boolean>>;
}

export interface DueDateFilterDropDownProps {
	showDueDateFilterDropDown: boolean;
	setShowDueDateFilterDropDown: Dispatch<SetStateAction<boolean>>;
}

export interface PriorityFilterDropDownProps {
	showPriorityFilterDropDown: boolean;
	setShowPriorityFilterDropDown: Dispatch<SetStateAction<boolean>>;
}
