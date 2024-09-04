export interface Props {
	showFilterDropDown: boolean;
	setShowFilterDropDown: (value: boolean) => void;
	handleFilter: (filterOption: FilterOption | null) => void;
}

export type FilterOption = {
	id: number;
	name: string;
	svg: JSX.Element;
	group: string;
};
