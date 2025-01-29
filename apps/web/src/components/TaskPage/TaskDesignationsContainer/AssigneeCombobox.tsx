"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useToast } from "@/components/ui/use-toast";
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
					className="h-8 justify-between md:h-10 md:w-full"
				>
					{assignee ? (
						<div className="flex w-28 items-center">
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
								<CommandItem onSelect={() => handleSelectAssignee(null)}>
									<UserSearch className="mx-1 size-4" />
									<span className="ml-2 w-2/3 truncate">Unassigned</span>
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
											<span className="ml-2 w-2/3 truncate">{user.name}</span>
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
