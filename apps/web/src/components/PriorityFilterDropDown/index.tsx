import { useState, useEffect } from "react";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { high, medium, low } from "@/components/Svg";
import { useViewsStore } from "@/storeZ/provider";
import type { PriorityFilterDropDownProps } from "./PriorityFilterDropDown.interfaces";
import { CircleAlert, Ellipsis } from "lucide-react";
import type { FilterCondition, TaskFilter } from "@/storeZ/views";

const groupPriority = [
	{
		id: 0,
		name: "No priority",
		border: false,
		svg: <Ellipsis className="size-4" />,
		group: "priority",
	},
	{
		id: 1,
		name: "Urgent",
		border: false,
		svg: <CircleAlert className="size-4 fill-destructive" />,
		group: "priority",
	},
	{
		id: 2,
		name: "High",
		border: false,
		svg: high(),
		group: "priority",
	},
	{
		id: 3,
		name: "Medium",
		border: false,
		svg: medium(),
		group: "priority",
	},
	{
		id: 4,
		name: "Low",
		border: false,
		svg: low(),
		group: "priority",
	},
];

const PriorityFilterDropDown = ({
	showPriorityFilterDropDown,
	setShowPriorityFilterDropDown,
}: PriorityFilterDropDownProps) => {
	const [query, setQuery] = useState("");
	const [filterOption, setFilterOption] = useState("");
	const { addFilter } = useViewsStore().getState();

	const filteredGroup =
		query === ""
			? groupPriority
			: groupPriority.filter((item) =>
					item.name
						.toLowerCase()
						.replace(/\s+/g, "")
						.includes(query.toLowerCase().replace(/\s+/g, "")),
				);

	useEffect(() => {
		if (filterOption) {
			const taskFilter: FilterCondition = {
				field: "priority",
				value: filterOption,
				operator: "equals",
			};

			addFilter(taskFilter);
			setShowPriorityFilterDropDown(false);
		}
	}, [filterOption]);

	return (
		<DropdownMenu
			open={showPriorityFilterDropDown}
			onOpenChange={setShowPriorityFilterDropDown}
		>
			<DropdownMenuTrigger asChild>
				<button
					className="flex items-center space-x-2 py-2 pl-3 pr-10 text-sm leading-5 text-foreground bg-secondary focus-visible:outline-none"
					type="button"
				>
					<span>Filter by Priority</span>
					<ChevronUpDownIcon
						className="h-5 w-5 text-gray-400"
						aria-hidden="true"
					/>
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-72 p-0">
				{filteredGroup.map((item) => (
					<DropdownMenuItem
						key={item.id}
						onSelect={() => setFilterOption(item.name)}
					>
						<div className="flex items-center space-x-2">
							{item.svg}
							<span>{item.name}</span>
						</div>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default PriorityFilterDropDown;
