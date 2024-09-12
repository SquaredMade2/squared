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
import { useFilterStore } from "@/storeZ";
import type { FilterCondition } from "@/storeZ/filters";
import type { PriorityFilterDropDownProps } from "./PriorityFilterDropDown.interfaces";

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
	const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
	const { addFilter, removeFilter } = useFilterStore((state) => state);

	const handlePriorityChange = (priority: string, checked: boolean) => {
		setSelectedPriorities((prev) =>
			checked ? [...prev, priority] : prev.filter((item) => item !== priority),
		);
	};

	useEffect(() => {
		// Apply or remove filters based on selected priorities
		if (selectedPriorities.length > 0) {
			for (const priority of selectedPriorities) {
				const taskFilter: FilterCondition = {
					field: "priority",
					value: priority,
					operator: "equals",
				};
				addFilter(taskFilter);
			}
		} else {
			removeFilter();
		}
		setShowPriorityFilterDropDown(false);
	}, [selectedPriorities]);

	return (
		<DropdownMenu
			open={showPriorityFilterDropDown}
			onOpenChange={setShowPriorityFilterDropDown}
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
						checked={selectedPriorities.includes(item.name)}
						onCheckedChange={(checked) =>
							handlePriorityChange(item.name, checked)
						}
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
