export type FilterOption = {
	id: number;
	name: string;
	svg: JSX.Element;
	group: string;
	menuContent: (filterOption: FilterOption) => JSX.Element;
};
