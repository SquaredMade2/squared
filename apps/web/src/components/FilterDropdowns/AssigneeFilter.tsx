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
			<PopoverContent className="w-72 p-0" sideOffset={5}>
				<Command>
					<CommandInput
						placeholder="Search users..."
						value={searchQuery}
						onValueChange={setSearchQuery}
					/>
					<CommandList>
						<CommandEmpty>No users found.</CommandEmpty>
						<CommandGroup>
							{filteredAssignees.map((user) => (
								<CommandItem
									key={user.id}
									onSelect={() => handleAssigneeChange(user)}
									className="flex items-center space-x-2 cursor-pointer"
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
										<span className="w-2/3 truncate">{user.username}</span>
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
