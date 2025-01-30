"use client";

import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { useFilterStore, useUserStore } from "@/store";
import { getFilterAssignees } from "@/store/filters/helpers";
import { getInitials } from "@/utils/formatting";
import type { User } from "@squared/db";
import { Check, UserSearch } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "../ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";
import type { FilterOption } from "./interfaces";

export default function AssigneeFilterDropDown({
	filterOption,
}: { filterOption: FilterOption }) {
	const { users } = useUserStore((state) => state);
	const { addFilter, removeFilter, currentFilterTypes, currentFilters } =
		useFilterStore((state) => state);
	const [selectedAssignees, setSelectedAssignees] = useState<(User | null)[]>(
		getFilterAssignees(currentFilters, users),
	);
	const [searchQuery, setSearchQuery] = useState("");

	const handleAssigneeChange = (label: User | null) => {
		setSelectedAssignees((prev) =>
			prev.some((l) => l?.externalId === label?.externalId)
				? prev.filter((l) => l?.externalId !== label?.externalId)
				: [...prev, label],
		);
	};

	useEffect(() => {
		removeFilter("assigneeId");
		if (selectedAssignees.length > 0) {
			addFilter({
				field: "assigneeId",
				value: selectedAssignees.map((u) => u?.externalId || null),
				operator: "arrayIncludesAny",
			});
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
						placeholder="Search users..."
						value={searchQuery}
						onValueChange={setSearchQuery}
					/>
					<CommandList>
						<CommandEmpty>No users found.</CommandEmpty>
						<ScrollArea
							className={`w-full h-${filteredAssignees.length > 12 ? "96" : "fit"}pr-${filteredAssignees.length > 12 ? "6" : "0"}`}
						>
							<CommandGroup>
								<CommandItem
									key="unassigned"
									onSelect={() => handleAssigneeChange(null)}
									className="flex h-8 cursor-pointer items-center space-x-2"
								>
									<div className="flex flex-1 items-center space-x-2">
										{selectedAssignees.some((l) => l === null) ? (
											<Check className="h-4 w-4" />
										) : (
											<div className="h-4 w-4" />
										)}
										<UserSearch className="mx-1 mr-2 size-5" />
										<span className="w-2/3 truncate">Unassigned</span>
									</div>
								</CommandItem>
								{filteredAssignees
									.sort((a, b) => a.name.localeCompare(b.name))
									.map((user) => (
										<CommandItem
											key={user.externalId}
											onSelect={() => handleAssigneeChange(user)}
											className="flex h-8 cursor-pointer items-center space-x-2"
										>
											<div className="flex flex-1 items-center space-x-2">
												{selectedAssignees.some(
													(l) => l?.id === user.externalId,
												) ? (
													<Check className="h-4 w-4" />
												) : (
													<div className="h-4 w-4" />
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
	);
}
