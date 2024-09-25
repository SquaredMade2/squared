"use client";

import { useState, useEffect } from "react";
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
	CommandGroup,
} from "@/components/ui/command";
import { useFilterStore, useWorkspaceStore } from "@/store";
import type { FilterDropDownProps } from "./interfaces";
import type { Label } from "@repo/db";
import { Check } from "lucide-react";

export default function LabelFilterDropDown({
	showFilterDropDown,
	setShowFilterDropDown,
}: FilterDropDownProps) {
	const { currentWorkspace } = useWorkspaceStore((state) => state);
	const [selectedLabels, setSelectedLabels] = useState<Label[]>([]);
	const { addFilter, removeFilter, currentFilterTypes } = useFilterStore(
		(state) => state,
	);
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
			addFilter({
				field: "labels",
				value: selectedLabels.map((label) => label.id),
				operator: "arrayIncludesAny",
			});
		} else {
			removeFilter("labels");
		}
	}, [selectedLabels, addFilter, removeFilter]);

	useEffect(() => {
		if (
			currentFilterTypes.length === 0 ||
			!currentFilterTypes.includes("labels")
		) {
			setSelectedLabels([]);
			console.log("selectedLabels", selectedLabels);
		}
	}, [currentFilterTypes]);

	const filteredLabels =
		currentWorkspace?.Labels.filter((label) =>
			label.name.toLowerCase().includes(searchQuery.toLowerCase()),
		) || [];

	return (
		<Popover open={showFilterDropDown} onOpenChange={setShowFilterDropDown}>
			<PopoverTrigger />
			<PopoverContent className="w-72 p-0" sideOffset={5}>
				<Command>
					<CommandInput
						placeholder="Search labels..."
						value={searchQuery}
						onValueChange={setSearchQuery}
					/>
					<CommandList>
						<CommandEmpty>No labels found.</CommandEmpty>
						<CommandGroup>
							{filteredLabels?.map((label) => (
								<CommandItem
									key={label.id}
									onSelect={() => handleLabelChange(label)}
									className="flex items-center space-x-2 cursor-pointer"
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
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
