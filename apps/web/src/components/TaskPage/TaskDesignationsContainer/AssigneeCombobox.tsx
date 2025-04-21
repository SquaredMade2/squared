"use client";

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
import { client } from "@/lib/client";
import { useEventStore, useTaskStore } from "@/store";
import { formatName, getInitials } from "@/utils/formatting";
import type { TaskEvent } from "@squaredmade/db";
import { Check, ChevronsUpDown, UserSearch } from "@squaredmade/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@squaredmade/ui/avatar";
import { Button } from "@squaredmade/ui/button";
import { cn } from "@squaredmade/ui/cn";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@squaredmade/ui/popover";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

const AssigneeCombobox = () => {
	const [open, setOpen] = useState(false);
	const { setEvents } = useEventStore((state) => state);
	const queryClient = useQueryClient();
	const { users } = useUsers();
	const { currentTask, setCurrentTask, updateTask } = useTaskStore(
		(state) => state,
	);

	const assignee = users?.find((u) => u.userId === currentTask?.assigneeId);

	const updateAssigneeMutation = useMutation({
		mutationFn: async (assigneeId?: string | null) => {
			if (!currentTask || assigneeId === undefined)
				throw new Error("Task or user not found");
			const res = await client.task.updateAssignee.$post({
				taskId: currentTask.id,
				assigneeId,
			});
			return res.json();
		},
		onSuccess: async (updatedTask) => {
			updateTask(updatedTask);
			setCurrentTask(updatedTask);
			const eventRes = await client.event.getEvents.$get({
				taskId: updatedTask.id,
			});
			const updatedEvents = await eventRes.json();
			setEvents(updatedEvents as TaskEvent[]);
			queryClient.invalidateQueries({
				queryKey: ["event", currentTask?.id],
			});
			toast.success("Assignee updated successfully");
		},
		onError: (error) => {
			toast.error("Error updating assignee", {
				description:
					error instanceof Error ? error.message : "Failed to update assignee",
			});
		},
	});

	if (!currentTask) return null;

	const handleSelectAssignee = (userId?: string | null) => {
		updateAssigneeMutation.mutate(userId);
		setOpen(false);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					aria-expanded={open}
					className="h-8 justify-between md:h-10 md:w-full"
				>
					{assignee ? (
						<div className="flex w-28 items-center">
							<Avatar className="size-6 text-xxs">
								<AvatarImage src={assignee.imageUrl ?? ""} />
								<AvatarFallback>
									{getInitials(formatName(assignee))}
								</AvatarFallback>
							</Avatar>
							<span className="ml-2 w-1/2 truncate text-xs">
								{formatName(assignee)}
							</span>
						</div>
					) : (
						<div className="flex items-center">
							<UserSearch className="mr-2 size-4" />
							<span>Unassigned</span>
						</div>
					)}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className={cn("w-[200px] p-0")}>
				<Command>
					<CommandInput placeholder="Search users..." />
					<CommandList>
						<ScrollArea className="h-80 pr-2">
							<CommandEmpty>No user found.</CommandEmpty>
							<CommandGroup>
								<CommandPinnedItem onSelect={() => handleSelectAssignee(null)}>
									<UserSearch className="mx-1 size-4" />
									<span className="ml-2 w-2/3 truncate">Unassigned</span>
									<Check
										className={cn(
											"ml-auto h-4 w-4",
											!currentTask.assigneeId ? "opacity-100" : "opacity-0",
										)}
									/>
								</CommandPinnedItem>
								{users
									?.sort((a, b) => formatName(a).localeCompare(formatName(b)))
									.map((user) => (
										<CommandItem
											key={user.userId}
											onSelect={() => handleSelectAssignee(user?.userId)}
											className="w-full"
										>
											<Avatar className="size-6 text-xxs">
												<AvatarImage src={user.imageUrl ?? ""} />
												<AvatarFallback>
													{getInitials(formatName(user))}
												</AvatarFallback>
											</Avatar>
											<span className="ml-2 w-2/3 truncate">
												{formatName(user)}
											</span>
											<Check
												className={cn(
													"ml-auto h-4 w-4",
													currentTask.assigneeId === user.userId
														? "opacity-100"
														: "opacity-0",
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
};

export default AssigneeCombobox;
