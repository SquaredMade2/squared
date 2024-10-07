"use client";

import { useState, useEffect } from "react";
import {
	DropdownMenuItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { low, medium, high } from "@/components/Svg";
import { useFilterStore } from "@/store/filters";
import { Check } from "lucide-react";
import type { FilterOption } from "./interfaces";

const effortOptions = [
	{ id: 0, name: 1, svg: low(), group: "effortEstimate" },
	{ id: 1, name: 2, svg: low(), group: "effortEstimate" },
	{ id: 2, name: 3, svg: low(), group: "effortEstimate" },
	{ id: 3, name: 4, svg: medium(), group: "effortEstimate" },
	{ id: 4, name: 5, svg: medium(), group: "effortEstimate" },
	{ id: 5, name: 6, svg: medium(), group: "effortEstimate" },
	{ id: 6, name: 7, svg: high(), group: "effortEstimate" },
	{ id: 7, name: 8, svg: high(), group: "effortEstimate" },
	{ id: 8, name: 9, svg: high(), group: "effortEstimate" },
	{ id: 9, name: 10, svg: high(), group: "effortEstimate" },
];

export default function EffortFilterDropDown({
	filterOption,
}: { filterOption: FilterOption }) {
	const [selectedEffort, setSelectedEffort] = useState<number | null>(null);
	const { addFilter, removeFilter, currentFilterTypes } = useFilterStore(
		(state) => state,
	);

	useEffect(() => {
		if (selectedEffort !== null) {
			removeFilter("effortEstimate");
			addFilter({
				field: "effortEstimate",
				value: selectedEffort,
				operator: "equals",
			});
		} else {
			removeFilter("effortEstimate");
		}
	}, [selectedEffort, addFilter, removeFilter]);

	useEffect(() => {
		if (
			currentFilterTypes.length === 0 ||
			!currentFilterTypes.includes("effortEstimate")
		) {
			setSelectedEffort(null);
		}
	}, [currentFilterTypes]);

	const handleEffortSelect = (effort: number) => {
		setSelectedEffort((prevEffort) => (prevEffort === effort ? null : effort));
	};

	return (
		<DropdownMenuSub>
			<DropdownMenuSubTrigger>
				<div className="flex items-center space-x-2">
					{filterOption.svg}
					<span>{filterOption.name}</span>
				</div>
			</DropdownMenuSubTrigger>
			<DropdownMenuSubContent className="w-70">
				{effortOptions.map((item) => (
					<DropdownMenuItem
						key={item.id}
						onSelect={(e) => {
							e.preventDefault();
							handleEffortSelect(item.name);
						}}
					>
						<div className="flex items-center gap-2">
							{selectedEffort === item.name ? (
								<Check className="size-4" />
							) : (
								<div className="size-4" />
							)}
							{item.svg}
							<span>{item.name}</span>
						</div>
					</DropdownMenuItem>
				))}
			</DropdownMenuSubContent>
		</DropdownMenuSub>
	);
}
