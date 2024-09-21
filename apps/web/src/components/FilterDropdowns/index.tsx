import { useState } from "react";
import { CircleDashed, Calendar, Clock, Tag, Filter } from "lucide-react";
import { high } from "@/components/Svg";

import PriorityFilterDropDown from "./PriorityFilter";
import StatusFilterDropDown from "./StatusFilter";
import EffortFilterDropDown from "./EffortFilter";

import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover";
import {
	Command,
	CommandInput,
	CommandList,
	CommandItem,
	CommandEmpty,
} from "@/components/ui/command";
import type { FilterOption } from "./interfaces";
import { Button } from "../ui/button";
import { useFilterStore } from "@/store";
import LabelFilterDropDown from "./LabelFilter";
import DueDateFilterDropDown from "./DueDateFilter";

// Renamed groupOne to filterOptions for better semantics
const filterOptions: FilterOption[] = [
	{
		id: 1,
		name: "Status",
		svg: <CircleDashed className="size-4" />,
		group: "Status",
	},
	{
		id: 2,
		name: "Priority",
		svg: high(),
		group: "Priority",
	},
	{
		id: 3,
		name: "Labels",
		svg: <Tag className="cursor-pointer size-4" />,
		group: "Labels",
	},
	{
		id: 4,
		name: "Due Date",
		svg: <Calendar className="cursor-pointer size-4" />,
		group: "Due Date",
	},
	{
		id: 5,
		name: "Effort",
		svg: <Clock className="cursor-pointer size-4" />,
		group: "effortEstimate",
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
	const [open, setOpen] = useState(false);

	const [showDueDateFilterDropDown, setShowDueDateFilterDropDown] =
		useState(false);
	const [showEffortFilterDropDown, setShowEffortFilterDropDown] =
		useState(false);
	const [showLabelFilterDropDown, setShowLabelFilterDropDown] = useState(false);
	const [showPriorityFilterDropDown, setShowPriorityFilterDropDown] =
		useState(false);
	const [showStatusFilterDropDown, setShowStatusFilterDropDown] =
		useState(false);
	const { currentFilters, clearFilter } = useFilterStore((state) => state);

	const handleSelect = (option: FilterOption) => {
		setOpen(false);

		switch (option.name) {
			case "Status":
				setShowStatusFilterDropDown(true);
				break;
			case "Priority":
				setShowPriorityFilterDropDown(true);
				break;
			case "Labels":
				setShowLabelFilterDropDown(true);
				break;
			case "Due Date":
				setShowDueDateFilterDropDown(true);
				break;
			case "Effort":
				setShowEffortFilterDropDown(true);
				break;
			default:
				break;
		}
	};

	return (
		<>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						onClick={
							currentFilters?.length && currentFilters?.length > 0
								? () => {
										clearFilter();
									}
								: () => {
										setOpen(true);
									}
						}
						variant={"ghost"}
					>
						<div className="flex gap-2 items-center">
							<Filter className="size-5" />
							<p>
								{currentFilters.length && currentFilters.length > 0
									? "Clear Filters x"
									: "Filter"}
							</p>
						</div>
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-72 p-0 ml-32">
					<Command>
						<CommandInput placeholder="Search filters..." />
						<CommandList>
							<CommandEmpty>No results found.</CommandEmpty>
							{filterOptions.map((item) => (
								<CommandItem
									key={item.name}
									value={item.name}
									onSelect={() => handleSelect(item)}
								>
									<div className="flex items-center space-x-2">
										{item.svg}
										<span>{item.name}</span>
									</div>
								</CommandItem>
							))}
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>

			<PriorityFilterDropDown
				setShowPriorityFilterDropDown={setShowPriorityFilterDropDown}
				showPriorityFilterDropDown={showPriorityFilterDropDown}
			/>
			<StatusFilterDropDown
				setShowStatusFilterDropDown={setShowStatusFilterDropDown}
				showStatusFilterDropDown={showStatusFilterDropDown}
			/>
			<LabelFilterDropDown
				setShowLabelFilterDropDown={setShowLabelFilterDropDown}
				showLabelFilterDropDown={showLabelFilterDropDown}
			/>
			<DueDateFilterDropDown
				setShowDueDateFilterDropDown={setShowDueDateFilterDropDown}
				showDueDateFilterDropDown={showDueDateFilterDropDown}
			/>
			<EffortFilterDropDown
				setShowEffortFilterDropDown={setShowEffortFilterDropDown}
				showEffortFilterDropDown={showEffortFilterDropDown}
			/>
		</>
	);
};

export default FilterDropDown;
