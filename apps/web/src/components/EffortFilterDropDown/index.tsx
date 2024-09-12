import { useState, useEffect } from "react";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { low, medium, high } from "@/components/Svg";
import type { EffortFilterDropDownProps } from "./EffortFilterDropDown.interfaces";
import { useFilterStore, type FilterCondition } from "@/storeZ/filters";

const groupEffort = [
	{
		id: 0,
		name: 1,
		border: false,
		svg: low(),
		group: "effortEstimate",
	},
	{
		id: 1,
		name: 2,
		border: false,
		svg: low(),
		group: "effortEstimate",
	},
	{
		id: 2,
		name: 3,
		border: false,
		svg: low(),
		group: "effortEstimate",
	},
	{
		id: 3,
		name: 5,
		border: false,
		svg: medium(),
		group: "effortEstimate",
	},
	{
		id: 4,
		name: 8,
		border: false,
		svg: medium(),
		group: "effortEstimate",
	},
	{
		id: 5,
		name: 13,
		border: false,
		svg: high(),
		group: "effortEstimate",
	},
	{
		id: 6,
		name: 21,
		border: false,
		svg: high(),
		group: "effortEstimate",
	},
];

const EffortFilterDropDown = ({
	showEffortFilterDropDown,
	setShowEffortFilterDropDown,
}: EffortFilterDropDownProps) => {
	const [query, setQuery] = useState("");
	const { addFilter } = useFilterStore((state) => state);

	const handleSelect = (effortValue: number) => {
		const filterCondition: FilterCondition = {
			field: "effortEstimate",
			value: effortValue,
			operator: "equals",
		};
		addFilter(filterCondition);
		setShowEffortFilterDropDown(false);
	};

	return (
		<DropdownMenu
			open={showEffortFilterDropDown}
			onOpenChange={setShowEffortFilterDropDown}
		>
			<DropdownMenuTrigger>
				<div className="hidden" aria-hidden="true" />
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-72 p-0 mt-5 mr-32">
				{groupEffort.map((item) => (
					<DropdownMenuItem
						key={item.id}
						onSelect={() => handleSelect(item.name)}
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

export default EffortFilterDropDown;
