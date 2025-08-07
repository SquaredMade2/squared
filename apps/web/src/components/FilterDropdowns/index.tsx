import {
	Calendar,
	CircleDashed,
	Clock,
	Filter,
	Lightbulb,
	Tag,
	User,
	X,
} from "@squaredmade/icons";
import { Button } from "@squaredmade/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@squaredmade/ui/dropdown-menu";
import { useFilterStore } from "@/store";
import { PriorityIcon } from "../Icons";
import AuthorAssigneeFilterDropDown from "./author-assignee-filter";
import DueDateFilterDropDown from "./due-date-filter";
import EffortFilterDropDown from "./effort-filter";
import type { FilterOption } from "./interfaces";
import LabelFilterDropDown from "./label-filter";
import PriorityFilterDropDown from "./priority-filter";
import StatusFilterDropDown from "./status-filter";

// Renamed groupOne to filterOptions for better semantics
const filterOptions: FilterOption[] = [
	{
		group: "Status",
		id: 1,
		menuContent: (filterOption) => (
			<StatusFilterDropDown filterOption={filterOption} />
		),
		name: "Status",
		svg: <CircleDashed className="size-4" />,
	},
	{
		group: "Priority",
		id: 2,
		menuContent: (filterOption) => (
			<PriorityFilterDropDown filterOption={filterOption} />
		),
		name: "Priority",
		svg: <PriorityIcon priority="urgent" />,
	},
	{
		group: "Labels",
		id: 3,
		menuContent: (filterOption) => (
			<LabelFilterDropDown filterOption={filterOption} />
		),
		name: "Labels",
		svg: <Tag className="size-4 cursor-pointer" />,
	},
	{
		group: "Due Date",
		id: 4,
		menuContent: (filterOption) => (
			<DueDateFilterDropDown filterOption={filterOption} />
		),
		name: "Due Date",
		svg: <Calendar className="size-4 cursor-pointer" />,
	},
	{
		group: "effortEstimate",
		id: 5,
		menuContent: (filterOption) => (
			<EffortFilterDropDown filterOption={filterOption} />
		),
		name: "Effort",
		svg: <Clock className="size-4 cursor-pointer" />,
	},
	{
		group: "Assignee",
		id: 6,
		menuContent: (filterOption) => (
			<AuthorAssigneeFilterDropDown
				author={false}
				filterOption={filterOption}
			/>
		),
		name: "Assignee",
		svg: <User className="size-4 cursor-pointer" />,
	},
	{
		group: "Author",
		id: 7,
		menuContent: (filterOption) => (
			<AuthorAssigneeFilterDropDown author={true} filterOption={filterOption} />
		),
		name: "Author",
		svg: <Lightbulb className="size-4 cursor-pointer" />,
	},
	// Future filter options to be implemented:
	// {
	//   id: 8,
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
				<DropdownMenuTrigger asChild>
					<Button variant="ghost">
						<div className="flex items-center gap-2">
							<Filter className="size-5" />
							Filter
						</div>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="ml-32 w-60">
					{filterOptions.map((item) => (
						<div key={item.name}>{item.menuContent(item)}</div>
					))}
				</DropdownMenuContent>
			</DropdownMenu>
			{currentFilters?.length > 0 && (
				<Button className="gap-2" onClick={clearFilter} variant="outline">
					Clear Filters <X className="size-4" />
				</Button>
			)}
		</div>
	);
};

export default FilterDropDown;
