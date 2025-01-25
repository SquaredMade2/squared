"use client";

import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { useFilterStore, useWorkspaceStore } from "@/store";
import type { Label } from "@squared/db";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import {
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "../ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";
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
			prev.some((l) => l.id === label.id)
				? prev.filter((l) => l.id !== label.id)
				: [...prev, label],
		);
	};

	useEffect(() => {
		if (selectedLabels.length > 0) {
			removeFilter("labels");
			addFilter({
				field: "labels",
				value: selectedLabels.map((label) => label.id),
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
									(filter.value as string[]).includes(label.id),
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
							className={`w-full h-${filteredLabels.length > 12 ? "96" : "fit"} pr-${filteredLabels.length > 12 ? "6" : "0"}`}
						>
							<CommandGroup>
								{filteredLabels?.map((label) => (
									<CommandItem
										key={label.id}
										onSelect={() => handleLabelChange(label)}
										className="flex items-center space-x-2 cursor-pointer h-8"
									>
										<div className="flex items-center flex-1 space-x-2">
											{selectedLabels.some((l) => l.id === label.id) ? (
												<Check className="w-4 h-4" />
											) : (
												<div className="w-4 h-4" />
											)}
											<div
												className="w-3 h-3 rounded-full"
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
