import { useState, useEffect } from "react";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuRadioItem,
	DropdownMenuRadioGroup,
} from "@/components/ui/dropdown-menu";
import { low, medium, high } from "@/components/Svg";
import type { EffortFilterDropDownProps } from "./interfaces";
import { useFilterStore } from "@/storeZ/filters";

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
		name: 4,
		border: false,
		svg: medium(),
		group: "effortEstimate",
	},
	{
		id: 4,
		name: 5,
		border: false,
		svg: medium(),
		group: "effortEstimate",
	},
	{
		id: 5,
		name: 6,
		border: false,
		svg: medium(),
		group: "effortEstimate",
	},
	{
		id: 6,
		name: 7,
		border: false,
		svg: high(),
		group: "effortEstimate",
	},
	{
		id: 7,
		name: 8,
		border: false,
		svg: high(),
		group: "effortEstimate",
	},
	{
		id: 8,
		name: 9,
		border: false,
		svg: high(),
		group: "effortEstimate",
	},
	{
		id: 9,
		name: 10,
		border: false,
		svg: high(),
		group: "effortEstimate",
	},
];

const EffortFilterDropDown = ({
	showEffortFilterDropDown,
	setShowEffortFilterDropDown,
}: EffortFilterDropDownProps) => {
	const [selectedEfforts, setSelectedEfforts] = useState<string>("");
	const { addFilter, removeFilter } = useFilterStore((state) => state);

	useEffect(() => {
		if (Number(selectedEfforts) > 0) {
			addFilter({
				field: "effortEstimate",
				value: Number(selectedEfforts),
				operator: "equals",
			});
		} else {
			removeFilter("status");
		}
	}, [selectedEfforts, addFilter, removeFilter]);

	return (
		<DropdownMenu
			open={showEffortFilterDropDown}
			onOpenChange={setShowEffortFilterDropDown}
		>
			<DropdownMenuTrigger>
				<div className="hidden" aria-hidden="true" />
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-72 p-0 mt-5 mr-32">
				<DropdownMenuRadioGroup
					value={selectedEfforts}
					onValueChange={setSelectedEfforts}
				>
					{groupEffort.map((item) => (
						<DropdownMenuRadioItem key={item.id} value={item.name.toString()}>
							<div className="flex items-center space-x-2">
								{item.svg}
								<span>{item.name}</span>
							</div>
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default EffortFilterDropDown;
