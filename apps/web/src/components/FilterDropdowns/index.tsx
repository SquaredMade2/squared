import {
	Calendar,
	CircleDashed,
	Clock,
	Filter,
	Tag,
	User,
	X,
} from "lucide-react";

import { useFilterStore } from "@/store";
import { PriorityIcon } from "../Icons";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import AssigneeFilterDropDown from "./AssigneeFilter";
import DueDateFilterDropDown from "./DueDateFilter";
import EffortFilterDropDown from "./EffortFilter";
import LabelFilterDropDown from "./LabelFilter";
import PriorityFilterDropDown from "./PriorityFilter";
import StatusFilterDropDown from "./StatusFilter";
import type { FilterOption } from "./interfaces";

// Renamed groupOne to filterOptions for better semantics
const filterOptions: FilterOption[] = [
	{
		id: 1,
		name: "Status",
		svg: <CircleDashed className="size-4" />,
		group: "Status",
		menuContent: (filterOption) => (
			<StatusFilterDropDown filterOption={filterOption} />
		),
	},
	{
		id: 2,
		name: "Priority",
		svg: <PriorityIcon priority={"urgent"} />,
		group: "Priority",
		menuContent: (filterOption) => (
			<PriorityFilterDropDown filterOption={filterOption} />
		),
	},
	{
		id: 3,
		name: "Labels",
		svg: <Tag className="cursor-pointer size-4" />,
		group: "Labels",
		menuContent: (filterOption) => (
			<LabelFilterDropDown filterOption={filterOption} />
		),
	},
	{
		id: 4,
		name: "Due Date",
		svg: <Calendar className="cursor-pointer size-4" />,
		group: "Due Date",
		menuContent: (filterOption) => (
			<DueDateFilterDropDown filterOption={filterOption} />
		),
	},
	{
		id: 5,
		name: "Effort",
		svg: <Clock className="cursor-pointer size-4" />,
		group: "effortEstimate",
		menuContent: (filterOption) => (
			<EffortFilterDropDown filterOption={filterOption} />
		),
	},
	{
		id: 6,
		name: "Assignee",
		svg: <User className="cursor-pointer size-4" />,
		group: "Assignee",
		menuContent: (filterOption) => (
			<AssigneeFilterDropDown filterOption={filterOption} />
		),
	},
	// Future filter options to be implemented:
	// {
	//   id: 6,
	//   name: 'Project',
	//   svg: projectFilter(),
	//   group: 'Project',
	// },
	// ...
];

const FilterDropDown: React.FunctionComponent = () => {
	const { currentFilters, clearFilter } = useFilterStore((state) => state);

	return (
		<div className="flex items-center">
			<DropdownMenu>
				<DropdownMenuTrigger>
					<Button variant="ghost">
						<div className="flex gap-2 items-center">
							<Filter className="size-5" />
							Filter
						</div>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-60 ml-32">
					{filterOptions.map((item) => (
						<div key={item.name}>{item.menuContent(item)}</div>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
			{currentFilters?.length > 0 && (
				<Button variant="outline" onClick={clearFilter} className="gap-2">
					Clear Filters <X className="size-4" />
				</Button>
			)}
		</div>
	);
};

export default FilterDropDown;
