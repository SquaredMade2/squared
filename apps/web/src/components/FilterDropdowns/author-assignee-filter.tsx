"use client";

import type { PublicUserData } from "@clerk/types";
import { Check, UserSearch } from "@squaredmade/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@squaredmade/ui/avatar";
import { cn } from "@squaredmade/ui/cn";
import {
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "@squaredmade/ui/dropdown-menu";
import { useEffect, useState } from "react";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandPinnedItem,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUsers } from "@/hooks/useUsers";
import { useFilterStore } from "@/store";
import { getFilterAssignees, getFilterAuthors } from "@/store/filters/helpers";
import { formatName, getInitials } from "@/utils/formatting";
import type { FilterOption } from "./interfaces";

export default function AuthorAssigneeFilterDropDown({
	filterOption,
	author,
}: {
	filterOption: FilterOption;
	author: boolean;
}) {
	const { users } = useUsers();
	const { addFilter, removeFilter, currentFilterTypes, currentFilters } =
		useFilterStore((state) => state);
	const [selectedAuthors, setSelectedAuthors] = useState<
		(PublicUserData | null)[]
	>(getFilterAuthors(currentFilters, users));
	const [selectedAssignees, setSelectedAssignees] = useState<
		(PublicUserData | null)[]
	>(getFilterAssignees(currentFilters, users));
	const [searchQueryAuthor, setSearchQueryAuthor] = useState("");
	const [searchQueryAssignee, setSearchQueryAssignee] = useState("");

	const handleChange = (label: PublicUserData | null) => {
		if (author) {
			setSelectedAuthors((prev) =>
				prev.some((l) => l?.userId === label?.userId)
					? prev.filter((l) => l?.userId !== label?.userId)
					: [...prev, label],
			);
		} else {
			setSelectedAssignees((prev) =>
				prev.some((l) => l?.userId === label?.userId)
					? prev.filter((l) => l?.userId !== label?.userId)
					: [...prev, label],
			);
		}
	};

	useEffect(() => {
		removeFilter("assigneeId");
		if (selectedAssignees.length > 0) {
			addFilter({
				field: "assigneeId",
				operator: "arrayIncludesAny",
				value: selectedAssignees.map((u) => u?.userId || null),
			});
		}
	}, [selectedAssignees]);

	useEffect(() => {
		removeFilter("authorId");
		if (selectedAuthors.length > 0) {
			addFilter({
				field: "authorId",
				operator: "arrayIncludesAny",
				value: selectedAuthors.map((u) => u?.userId || null),
			});
		}
	}, [selectedAuthors]);

	useEffect(() => {
		if (
			currentFilterTypes.length === 0 ||
			!currentFilterTypes.includes("authorId")
		) {
			setSelectedAuthors([]);
		}
		if (
			currentFilterTypes.length === 0 ||
			!currentFilterTypes.includes("assigneeId")
		) {
			setSelectedAssignees([]);
		}
	}, [currentFilterTypes]);

	let filteredUsers: PublicUserData[] = [];
	if (author) {
		filteredUsers =
			users?.filter((u) =>
				formatName(u).toLowerCase().includes(searchQueryAuthor.toLowerCase()),
			) || [];
	} else {
		filteredUsers =
			users?.filter((u) =>
				formatName(u).toLowerCase().includes(searchQueryAssignee.toLowerCase()),
			) || [];
	}

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
					{author ? (
						<CommandInput
							onValueChange={setSearchQueryAuthor}
							placeholder="Search users..."
							value={searchQueryAuthor}
						/>
					) : (
						<CommandInput
							onValueChange={setSearchQueryAssignee}
							placeholder="Search users..."
							value={searchQueryAssignee}
						/>
					)}
					<CommandList>
						<CommandEmpty>No users found.</CommandEmpty>
						<ScrollArea
							className={cn(
								"w-full",
								filteredUsers.length > 12 ? "h-96 pr-6" : "h-fit pr-0",
							)}
						>
							<CommandGroup>
								<CommandPinnedItem
									className="flex h-8 cursor-pointer items-center space-x-2"
									key="unassigned"
									onSelect={() => handleChange(null)}
								>
									<div className="flex flex-1 items-center space-x-2">
										{author && selectedAuthors.some((l) => l === null) ? (
											<Check className="h-4 w-4" />
										) : (
											<div className="h-4 w-4" />
										)}
										{!author && selectedAssignees.some((l) => l === null) ? (
											<Check className="h-4 w-4" />
										) : (
											<div className="h-4 w-4" />
										)}
										<UserSearch className="mx-1 mr-2 size-5" />
										<span className="w-2/3 truncate">Unassigned</span>
									</div>
								</CommandPinnedItem>
								{filteredUsers
									.sort((a, b) => formatName(a).localeCompare(formatName(b)))
									.map((user) => (
										<CommandItem
											className="flex h-8 cursor-pointer items-center space-x-2"
											key={user.userId}
											onSelect={() => handleChange(user)}
										>
											<div className="flex flex-1 items-center space-x-2">
												{author &&
												selectedAuthors.some(
													(l) => l?.userId === user.userId,
												) ? (
													<Check className="h-4 w-4" />
												) : (
													<div className="h-4 w-4" />
												)}
												{!author &&
												selectedAssignees.some(
													(l) => l?.userId === user.userId,
												) ? (
													<Check className="h-4 w-4" />
												) : (
													<div className="h-4 w-4" />
												)}
												<Avatar className="size-6 text-xxs">
													<AvatarImage src={user?.imageUrl} />
													<AvatarFallback>
														{getInitials(formatName(user))}
													</AvatarFallback>
												</Avatar>
												<span className="w-2/3 truncate">
													{formatName(user)}
												</span>
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
