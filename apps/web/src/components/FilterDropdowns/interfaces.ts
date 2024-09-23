export type FilterOption = {
	id: number;
	name: string;
	svg: JSX.Element;
	group: string;
};

import type { Dispatch, SetStateAction } from "react";

export interface FilterDropDownProps {
	showFilterDropDown: boolean;
	setShowFilterDropDown: Dispatch<SetStateAction<boolean>>;
}
