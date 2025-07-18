"use client";

import type { PublicUserData } from "@clerk/types";
import { Check, UserSearch } from "@squaredmade/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@squaredmade/ui/avatar";
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
import { getFilterAuthors } from "@/store/filters/helpers";
import { formatName, getInitials } from "@/utils/formatting";
import type { FilterOption } from "./interfaces";

export default function AuthorFilterDropDown({
	filterOption,
}: {
	filterOption: FilterOption;
}) {
	const { users } = useUsers();
	const { addFilter, removeFilter, currentFilterTypes, currentFilters } =
		useFilterStore((state) => state);
	const [selectedAuthors, setSelectedAuthors] = useState<
		(PublicUserData | null)[]
	>(getFilterAuthors(currentFilters, users));
	const [searchQuery, setSearchQuery] = useState("");

	const handleAuthorChange = (label: PublicUserData | null) => {
		setSelectedAuthors((prev) =>
			prev.some((l) => l?.userId === label?.userId)
				? prev.filter((l) => l?.userId !== label?.userId)
				: [...prev, label],
		);
	};

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
	}, [currentFilterTypes]);

	const filteredAuthors =
		users?.filter((u) =>
			formatName(u).toLowerCase().includes(searchQuery.toLowerCase()),
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
						onValueChange={setSearchQuery}
						placeholder="Search users..."
						value={searchQuery}
					/>
					<CommandList>
						<CommandEmpty>No users found.</CommandEmpty>
						<ScrollArea
							className={`w-full h-${filteredAuthors.length > 12 ? "96" : "fit"}pr-${filteredAuthors.length > 12 ? "6" : "0"}`}
						>
							<CommandGroup>
								<CommandPinnedItem
									className="flex h-8 cursor-pointer items-center space-x-2"
									key="unassigned"
									onSelect={() => handleAuthorChange(null)}
								>
									<div className="flex flex-1 items-center space-x-2">
										{selectedAuthors.some((l) => l === null) ? (
											<Check className="h-4 w-4" />
										) : (
											<div className="h-4 w-4" />
										)}
										<UserSearch className="mx-1 mr-2 size-5" />
										<span className="w-2/3 truncate">Unassigned</span>
									</div>
								</CommandPinnedItem>
								{filteredAuthors
									.sort((a, b) => formatName(a).localeCompare(formatName(b)))
									.map((user) => (
										<CommandItem
											className="flex h-8 cursor-pointer items-center space-x-2"
											key={user.userId}
											onSelect={() => handleAuthorChange(user)}
										>
											<div className="flex flex-1 items-center space-x-2">
												{selectedAuthors.some(
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
