"use client";

import { useEffect, useState } from "react";
import { Check, ChevronsUpDown, UserSearch } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/formatting";
import { useTaskStore, useUserStore, useWorkspaceStore } from "@/store";
import type { ButtonProps } from "./interfaces";

export default function AssigneeCombobox({ currentTask }: ButtonProps) {
	const [open, setOpen] = useState(false);

	// Move these to a custom hook or memoize if needed
	const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace);
	const updateTask = useTaskStore((state) => state.updateTask);
	const users = useUserStore((state) => state.users);
	const getAllUsers = useUserStore((state) => state.getAllUsers);

	// Derive values from props instead of state
	const taskId = currentTask?.id ?? "";
	const assigneeName = currentTask?.assigneeName ?? "";
	const assigneeId = currentTask?.assigneeId ?? "";
	const assigneeAvatar = users.find(({ id }) => id === assigneeId)?.avatarUrl;

	// Only fetch users when workspace changes
	useEffect(() => {
		if (currentWorkspace?.id) {
			getAllUsers(currentWorkspace.id);
		}
	}, [currentWorkspace?.id, getAllUsers]);

	const handleSelectAssignee = async (userId: string | null) => {
		setOpen(false); // Close popover after selection

		if (!taskId) return; // Guard clause for no task

		const updates = userId
			? {
					assigneeId: userId,
					assigneeName: users.find((user) => user.id === userId)?.name ?? "",
				}
			: { assigneeId: null, assigneeName: null };

		await updateTask(taskId, updates);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					aria-expanded={open}
					className="justify-between md:w-full h-8 md:h-10"
				>
					{assigneeName ? (
						<div className="flex items-center w-28">
							<Avatar className="size-6 text-xxs">
								<AvatarImage src={assigneeAvatar ?? ""} />
								<AvatarFallback>{getInitials(assigneeName)}</AvatarFallback>
							</Avatar>
							<span className="ml-2 w-1/2 truncate text-xs">
								{assigneeName}
							</span>
						</div>
					) : (
						<div className="flex items-center">
							<UserSearch className="size-4 mr-2" />
							<span>Unassigned</span>
						</div>
					)}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className={cn("p-0 w-[200px]")}>
				<Command>
					<CommandInput placeholder="Search users..." />
					<CommandList>
						<ScrollArea className="h-80 pr-2">
							<CommandEmpty>No user found.</CommandEmpty>
							<CommandGroup>
								<CommandItem onSelect={() => handleSelectAssignee(null)}>
									<UserSearch className="size-4 mx-1" />
									<span className="w-2/3 truncate ml-2">Unassign</span>
									<Check
										className={cn(
											"ml-auto h-4 w-4",
											!assigneeId ? "opacity-100" : "opacity-0",
										)}
									/>
								</CommandItem>
								{users.map((user) => (
									<CommandItem
										key={user.id}
										onSelect={() => handleSelectAssignee(user.id)}
										className="w-full"
									>
										<Avatar className="size-6 text-xxs">
											<AvatarImage src={user.avatarUrl ?? ""} />
											<AvatarFallback>{getInitials(user.name)}</AvatarFallback>
										</Avatar>
										<span className="w-2/3 truncate ml-2">{user.username}</span>
										<Check
											className={cn(
												"ml-auto h-4 w-4",
												assigneeId === user.id ? "opacity-100" : "opacity-0",
											)}
										/>
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
