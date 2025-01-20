"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@squared/ui/avatar";
import { Button } from "@squared/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@squared/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@squared/ui/popover";
import { ScrollArea } from "@squared/ui/scroll-area";
import { useToast } from "@squared/ui/hooks";
import { client } from "@/lib/client";
import { useTaskStore, useUserStore } from "@/store";
import { cn } from "@/utils/cn";
import { getInitials } from "@/utils/formatting";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, ChevronsUpDown, UserSearch } from "lucide-react";
import { useState } from "react";

const AssigneeCombobox = () => {
	const [open, setOpen] = useState(false);
	const { toast } = useToast();
	const queryClient = useQueryClient();
	const { users } = useUserStore((state) => state);
	const { currentTask, setCurrentTask, updateTask } = useTaskStore(
		(state) => state,
	);

	const assignee = users.find((u) => u.externalId === currentTask?.assigneeId);

	const updateAssigneeMutation = useMutation({
		mutationFn: async (assigneeId: string | null) => {
			if (!currentTask) throw new Error("Task or user not found");
			const res = await client.task.updateAssignee.$post({
				taskId: currentTask.id,
				assigneeId,
			});
			return res.json();
		},
		onSuccess: (updatedTask) => {
			updateTask(updatedTask);
			setCurrentTask(updatedTask);
			queryClient.invalidateQueries({
				queryKey: ["taskEvents", currentTask?.id],
			});
			toast({
				title: "Success",
				description: "Assignee updated successfully",
			});
		},
		onError: (error) => {
			toast({
				title: "Error",
				description:
					error instanceof Error ? error.message : "Failed to update assignee",
				variant: "destructive",
			});
		},
	});

	if (!currentTask) return null;

	const handleSelectAssignee = (userId: string | null) => {
		updateAssigneeMutation.mutate(userId);
		setOpen(false);
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					aria-expanded={open}
					className="justify-between md:w-full h-8 md:h-10"
				>
					{assignee ? (
						<div className="flex items-center w-28">
							<Avatar className="size-6 text-xxs">
								<AvatarImage src={assignee.avatarUrl ?? ""} />
								<AvatarFallback>{getInitials(assignee.name)}</AvatarFallback>
							</Avatar>
							<span className="ml-2 w-1/2 truncate text-xs">
								{assignee.name}
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
									<span className="w-2/3 truncate ml-2">Unassigned</span>
									<Check
										className={cn(
											"ml-auto h-4 w-4",
											!currentTask.assigneeId ? "opacity-100" : "opacity-0",
										)}
									/>
								</CommandItem>
								{users
									.sort((a, b) => a.name.localeCompare(b.name))
									.map((user) => (
										<CommandItem
											key={user.externalId}
											onSelect={() => handleSelectAssignee(user.externalId)}
											className="w-full"
										>
											<Avatar className="size-6 text-xxs">
												<AvatarImage src={user.avatarUrl ?? ""} />
												<AvatarFallback>
													{getInitials(user.name)}
												</AvatarFallback>
											</Avatar>
											<span className="w-2/3 truncate ml-2">{user.name}</span>
											<Check
												className={cn(
													"ml-auto h-4 w-4",
													currentTask.assigneeId === user.externalId
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
