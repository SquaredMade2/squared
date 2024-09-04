import { useState } from "react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { CircleDashed, Calendar, Clock, Tag } from "lucide-react";
import { high } from "@/components/Svg";

import PriorityFilterDropDown from "@/components/PriorityFilterDropDown";
import StatusFilterDropDown from "@/components/StatusFilterDropDown";
import LabelFilterDropDown from "@/components/LabelFilterDropDown";
import DueDateFilterDropDown from "@/components/DueDateFilterDropDown";
import EffortFilterDropDown from "@/components/EffortFilterDropDown";

import { useViewsStore } from "@/storeZ/provider";
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
import type { FilterOption } from "./FilterDropdown.interfaces";
import type { Task } from "@repo/db";
import type { TaskFilter } from "@/storeZ/views";

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
	const [filterOption, setFilterOption] = useState<FilterOption | null>(null);
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");

	const [showDueDateFilterDropDown, setShowDueDateFilterDropDown] =
		useState(false);
	const [showEffortFilterDropDown, setShowEffortFilterDropDown] =
		useState(false);
	const [showLabelFilterDropDown, setShowLabelFilterDropDown] = useState(false);
	const [showPriorityFilterDropDown, setShowPriorityFilterDropDown] =
		useState(false);
	const [showStatusFilterDropDown, setShowStatusFilterDropDown] =
		useState(false);

	const handleSelect = (option: FilterOption) => {
		setFilterOption(option);
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
					<button
						className="flex items-center space-x-2 py-2 pl-3 pr-10 text-sm leading-5 text-foreground bg-secondary focus-visible:outline-none"
						type="button"
					>
						<span>Filter</span>
						<ChevronUpDownIcon
							className="h-5 w-5 text-gray-400"
							aria-hidden="true"
						/>
					</button>
				</PopoverTrigger>
				<PopoverContent className="w-72 p-0">
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
