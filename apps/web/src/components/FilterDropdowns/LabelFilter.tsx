"use client";

import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFilterStore, useWorkspaceStore } from "@/store";
import type { Label } from "@squaredmade/db";
import { Check } from "@squaredmade/icons";
import {
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "@squaredmade/ui/dropdown-menu";
import { useEffect, useState } from "react";
import type { FilterOption } from "./interfaces";

export default function LabelFilterDropDown({
	filterOption,
}: { filterOption: FilterOption }) {
	const workspace = useWorkspaceStore((state) => state.workspace);
	const [selectedLabels, setSelectedLabels] = useState<Label[]>([]);
	const { addFilter, removeFilter, currentFilterTypes, currentFilters } =
		useFilterStore((state) => state);
	const [searchQuery, setSearchQuery] = useState("");

	const handleLabelChange = (label: Label) => {
		setSelectedLabels((prev) =>
			prev.some((l) => l === label)
				? prev.filter((l) => l !== label)
				: [...prev, label],
		);
	};

	useEffect(() => {
		if (selectedLabels.length > 0) {
			removeFilter("labels");
			addFilter({
				field: "labels",
				value: selectedLabels.map((label) => label.name),
				operator: "arrayIncludesAny",
			});
		} else {
			if (currentFilterTypes.includes("labels")) {
				setSelectedLabels(
					currentFilters
						.filter((filter) => filter.field === "labels")
						.flatMap(
							(filter) =>
								workspace?.labels?.filter((label) =>
									(filter.value as string[]).includes(label.name),
								) ?? [],
						),
				);
			} else {
				removeFilter("labels");
			}
		}
	}, [selectedLabels, addFilter, removeFilter]);

	useEffect(() => {
		if (
			currentFilterTypes.length === 0 ||
			!currentFilterTypes.includes("labels")
		) {
			setSelectedLabels([]);
		}
	}, [currentFilterTypes]);

	const filteredLabels =
		workspace?.labels?.filter((label) =>
			label.name.toLowerCase().includes(searchQuery.toLowerCase()),
		) || [];

	return (
		<DropdownMenuSub>
			<DropdownMenuSubTrigger>
				<div className="flex items-center space-x-2">
					{filterOption.svg}
					<span>{filterOption.name}</span>
				</div>
			</DropdownMenuSubTrigger>
			<DropdownMenuSubContent className="w-[17.5rem]">
				<Command>
					<CommandInput
						placeholder="Search labels..."
						value={searchQuery}
						onValueChange={setSearchQuery}
					/>
					<CommandList>
						<CommandEmpty>No labels found.</CommandEmpty>
						<ScrollArea
							className={`w-full h-${filteredLabels.length > 12 ? "96" : "fit"}pr-${filteredLabels.length > 12 ? "6" : "0"}`}
						>
							<CommandGroup>
								{filteredLabels?.map((label) => (
									<CommandItem
										key={label.name}
										onSelect={() => handleLabelChange(label)}
										className="flex h-8 cursor-pointer items-center space-x-2"
									>
										<div className="flex flex-1 items-center space-x-2">
											{selectedLabels.some((l) => l === label) ? (
												<Check className="h-4 w-4" />
											) : (
												<div className="h-4 w-4" />
											)}
											<div
												className="h-3 w-3 rounded-full"
												style={{ backgroundColor: label.color }}
											/>
											<span>{label.name}</span>
										</div>
									</CommandItem>
								))}
							</CommandGroup>
						</ScrollArea>
					</CommandList>
				</Command>
			</DropdownMenuSubContent>
		</DropdownMenuSub>
	);
}
