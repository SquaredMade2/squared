import { useState, useEffect } from "react";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuCheckboxItem,
	DropdownMenuSeparator,
	DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { high, medium, low } from "@/components/Svg";
import { CircleAlert, Ellipsis } from "lucide-react";
import { useFilterStore } from "@/store";
import type { FilterDropDownProps } from "./interfaces";
import { Priority } from "@repo/db";

const groupPriority = [
	{
		id: 0,
		name: "No priority",
		border: false,
		svg: <Ellipsis className="size-4" />,
		group: "priority",
		value: Priority.noPriority,
	},
	{
		id: 1,
		name: "Low",
		border: false,
		svg: low(),
		group: "priority",
		value: Priority.low,
	},
	{
		id: 2,
		name: "Medium",
		border: false,
		svg: medium(),
		group: "priority",
		value: Priority.medium,
	},
	{
		id: 3,
		name: "High",
		border: false,
		svg: high(),
		group: "priority",
		value: Priority.high,
	},
	{
		id: 4,
		name: "Urgent",
		border: false,
		svg: <CircleAlert className="size-4 fill-destructive" />,
		group: "priority",
		value: Priority.urgent,
	},
];

const PriorityFilterDropDown = ({
	showFilterDropDown,
	setShowFilterDropDown,
}: FilterDropDownProps) => {
	const [selectedPriorities, setSelectedPriorities] = useState<Priority[]>([]);
	const { addFilter, removeFilter, currentFilterTypes } = useFilterStore(
		(state) => state,
	);

	const handlePriorityChange = (priority: Priority, checked: boolean) => {
		setSelectedPriorities((prev) =>
			checked ? [...prev, priority] : prev.filter((item) => item !== priority),
		);
	};

	useEffect(() => {
		if (selectedPriorities.length > 0) {
			addFilter({
				field: "priority",
				value: selectedPriorities,
				operator: "arrayIncludesAny",
			});
		} else {
			removeFilter("status");
		}
	}, [selectedPriorities, addFilter, removeFilter]);

	useEffect(() => {
		if (
			currentFilterTypes.length === 0 ||
			!currentFilterTypes.includes("priority")
		) {
			setSelectedPriorities([]);
		}
	}, [currentFilterTypes]);

	return (
		<DropdownMenu
			open={showFilterDropDown}
			onOpenChange={setShowFilterDropDown}
		>
			<DropdownMenuTrigger>
				<div className="hidden" aria-hidden="true" />
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-72 p-0 mt-6 mr-32">
				<DropdownMenuLabel>Priority</DropdownMenuLabel>
				<DropdownMenuSeparator />
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
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default PriorityFilterDropDown;
