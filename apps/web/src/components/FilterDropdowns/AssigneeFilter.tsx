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
import { useFilterStore, useUserStore } from "@/store";
import type { FilterDropDownProps } from "./interfaces";
import type { User } from "@repo/db";
import { Check } from "lucide-react";
import ProfileImage from "../ProfileImage";
import { ScrollArea } from "../ui/scroll-area";

export default function AssigneeFilterDropDown({
	showFilterDropDown,
	setShowFilterDropDown,
}: FilterDropDownProps) {
	const { users } = useUserStore((state) => state);
	const [selectedAssignees, setSelectedAssignees] = useState<User[]>([]);
	const { addFilter, removeFilter, currentFilterTypes } = useFilterStore(
		(state) => state,
	);
	const [searchQuery, setSearchQuery] = useState("");

	const handleAssigneeChange = (label: User) => {
		setSelectedAssignees((prev) =>
			prev.some((l) => l.id === label.id)
				? prev.filter((l) => l.id !== label.id)
				: [...prev, label],
		);
	};

	useEffect(() => {
		if (selectedAssignees.length > 0) {
			removeFilter("assigneeId");
			addFilter({
				field: "assigneeId",
				value: selectedAssignees.map((u) => u.id),
				operator: "arrayIncludesAny",
			});
		} else {
			removeFilter("assigneeId");
		}
	}, [selectedAssignees]);

	useEffect(() => {
		if (
			currentFilterTypes.length === 0 ||
			!currentFilterTypes.includes("assigneeId")
		) {
			setSelectedAssignees([]);
		}
	}, [currentFilterTypes]);

	const filteredAssignees =
		users.filter((u) =>
			u.name.toLowerCase().includes(searchQuery.toLowerCase()),
		) || [];

	return (
		<Popover open={showFilterDropDown} onOpenChange={setShowFilterDropDown}>
			<PopoverTrigger />
			<PopoverContent className="w-60 mt-5">
				<Command>
					<CommandInput
						placeholder="Search users..."
						value={searchQuery}
						onValueChange={setSearchQuery}
					/>
					<CommandList>
						<CommandEmpty>No users found.</CommandEmpty>
						<ScrollArea
							className={`w-full h-${filteredAssignees.length > 12 ? "96" : "fit"} pr-${filteredAssignees.length > 12 ? "6" : "0"}`}
						>
							<CommandGroup>
								{filteredAssignees
									.sort((a, b) => a.name.localeCompare(b.name))
									.map((user) => (
										<CommandItem
											key={user.id}
											onSelect={() => handleAssigneeChange(user)}
											className="flex items-center space-x-2 cursor-pointer h-8"
										>
											<div className="flex items-center flex-1 space-x-2">
												{selectedAssignees.some((l) => l.id === user.id) ? (
													<Check className="w-4 h-4" />
												) : (
													<div className="w-4 h-4" />
												)}
												<ProfileImage
													profileName={user.name}
													location="assigneeDropdown"
												/>
												<span className="w-2/3 truncate">{user.name}</span>
											</div>
										</CommandItem>
									))}
							</CommandGroup>
						</ScrollArea>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
