"use client";

import { useState, useEffect } from "react";
import {
	Command,
	CommandInput,
	CommandList,
	CommandItem,
	CommandEmpty,
	CommandGroup,
} from "@/components/ui/command";
import { useFilterStore, useUserStore } from "@/store";

import type { User } from "@repo/db";
import { Check, UserSearch } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/utils/formatting";
import type { FilterOption } from "./interfaces";
import {
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "../ui/dropdown-menu";

export default function AssigneeFilterDropDown({
	filterOption,
}: { filterOption: FilterOption }) {
	const { users } = useUserStore((state) => state);
	const [selectedAssignees, setSelectedAssignees] = useState<(User | null)[]>(
		[],
	);
	const { addFilter, removeFilter, currentFilterTypes } = useFilterStore(
		(state) => state,
	);
	const [searchQuery, setSearchQuery] = useState("");

	const handleAssigneeChange = (label: User | null) => {
		setSelectedAssignees((prev) =>
			prev.some((l) => l?.id === label?.id)
				? prev.filter((l) => l?.id !== label?.id)
				: [...prev, label],
		);
	};

	useEffect(() => {
		if (selectedAssignees.length > 0) {
			removeFilter("assigneeId");
			addFilter({
				field: "assigneeId",
				value: selectedAssignees.map((u) => u?.id || null),
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
		<>
			<DropdownMenuSub>
				<DropdownMenuSubTrigger>
					<div className="flex items-center space-x-2">
						{filterOption.svg}
						<span>{filterOption.name}</span>
					</div>
				</DropdownMenuSubTrigger>
				<DropdownMenuSubContent className="w-70">
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
									<CommandItem
										key="unassigned"
										onSelect={() => handleAssigneeChange(null)}
										className="flex items-center space-x-2 cursor-pointer h-8"
									>
										<div className="flex items-center flex-1 space-x-2">
											{selectedAssignees.some((l) => l === null) ? (
												<Check className="w-4 h-4" />
											) : (
												<div className="w-4 h-4" />
											)}
											<UserSearch className="size-5 mx-1 mr-2" />
											<span className="w-2/3 truncate">Unassigned</span>
										</div>
									</CommandItem>
									{filteredAssignees
										.sort((a, b) => a.name.localeCompare(b.name))
										.map((user) => (
											<CommandItem
												key={user.id}
												onSelect={() => handleAssigneeChange(user)}
												className="flex items-center space-x-2 cursor-pointer h-8"
											>
												<div className="flex items-center flex-1 space-x-2">
													{selectedAssignees.some((l) => l?.id === user.id) ? (
														<Check className="w-4 h-4" />
													) : (
														<div className="w-4 h-4" />
													)}
													<Avatar className="size-6 text-xxs">
														<AvatarImage src={user?.avatarUrl ?? ""} />
														<AvatarFallback>
															{getInitials(user.name)}
														</AvatarFallback>
													</Avatar>
													<span className="w-2/3 truncate">{user.name}</span>
												</div>
											</CommandItem>
										))}
								</CommandGroup>
							</ScrollArea>
						</CommandList>
					</Command>
				</DropdownMenuSubContent>
			</DropdownMenuSub>
		</>
		// <Popover open={showFilterDropDown} onOpenChange={setShowFilterDropDown}>
		// 	<PopoverTrigger />
		// 	<PopoverContent className="w-60 mt-5">

		// 	</PopoverContent>
		// </Popover>
	);
}
