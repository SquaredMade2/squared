import {
	DropdownMenuCheckboxItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { useFilterStore } from "@/store";
import { Priority } from "@squaredmade/db";
import { useEffect, useState } from "react";
import { PriorityIcon } from "../Icons";
import type { FilterOption } from "./interfaces";

const groupPriority = [
	{
		id: 0,
		name: "No priority",
		border: false,
		svg: <PriorityIcon priority={Priority.noPriority} />,
		group: "priority",
		value: Priority.noPriority,
	},
	{
		id: 1,
		name: "Low",
		border: false,
		svg: <PriorityIcon priority={Priority.low} />,
		group: "priority",
		value: Priority.low,
	},
	{
		id: 2,
		name: "Medium",
		border: false,
		svg: <PriorityIcon priority={Priority.medium} />,
		group: "priority",
		value: Priority.medium,
	},
	{
		id: 3,
		name: "High",
		border: false,
		svg: <PriorityIcon priority={Priority.high} />,
		group: "priority",
		value: Priority.high,
	},
	{
		id: 4,
		name: "Urgent",
		border: false,
		svg: <PriorityIcon priority={Priority.urgent} />,
		group: "priority",
		value: Priority.urgent,
	},
];

const PriorityFilterDropDown = ({
	filterOption,
}: { filterOption: FilterOption }) => {
	const [selectedPriorities, setSelectedPriorities] = useState<Priority[]>([]);
	const { addFilter, removeFilter, currentFilterTypes, currentFilters } =
		useFilterStore((state) => state);

	const handlePriorityChange = (priority: Priority, checked: boolean) => {
		setSelectedPriorities((prev) =>
			checked ? [...prev, priority] : prev.filter((item) => item !== priority),
		);
	};

	useEffect(() => {
		removeFilter("priority");
		if (selectedPriorities.length > 0) {
			addFilter({
				field: "priority",
				value: selectedPriorities,
				operator: "arrayIncludesAny",
			});
		}
	}, [selectedPriorities, addFilter, removeFilter]);

	useEffect(() => {
		if (
			selectedPriorities.length === 0 &&
			currentFilterTypes.includes("priority")
		) {
			const priorityValues = currentFilters
				.filter((filter) => filter.field === "priority")
				.flatMap((filter) => filter.value) as Priority[];

			if (priorityValues.length > 0) {
				setSelectedPriorities(priorityValues);
			}
		}
	}, [currentFilterTypes, currentFilters]);

	return (
		<DropdownMenuSub>
			<DropdownMenuSubTrigger>
				<div className="flex items-center space-x-2">
					{filterOption.svg}
					<span>{filterOption.name}</span>
				</div>
			</DropdownMenuSubTrigger>
			<DropdownMenuSubContent className="w-[17.5rem]">
				{groupPriority.map((item) => (
					<DropdownMenuCheckboxItem
						key={item.id}
						checked={selectedPriorities.includes(item.value)}
						onCheckedChange={(checked) =>
							handlePriorityChange(item.value, checked)
						}
						onSelect={(e) => {
							e.preventDefault();
						}}
					>
						<div className="flex items-center space-x-2">
							{item.svg}
							<span>{item.name}</span>
						</div>
					</DropdownMenuCheckboxItem>
				))}
			</DropdownMenuSubContent>
		</DropdownMenuSub>
	);
};

export default PriorityFilterDropDown;
