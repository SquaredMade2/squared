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
import { useTaskStore, useUserStore, useWorkspaceStore } from "@/store";
import type { ButtonProps } from "./interfaces";
import { ScrollArea } from "../../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/formatting";

const AssigneeCombobox = ({ currentTask }: ButtonProps) => {
	const [open, setOpen] = useState(false);

	const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace);
	const { getAllUsers, users } = useUserStore((state) => ({
		getAllUsers: state.getAllUsers,
		users: state.users,
	}));
	const { updateTask } = useTaskStore((state) => ({
		updateTask: state.updateTask,
	}));

	const taskId = currentTask?.id ?? "";
	const assigneeName = currentTask?.assigneeName ?? "";
	const assigneeId = currentTask?.assigneeId ?? "";
	const assigneeAvatar = users.find(({ id }) => id === assigneeId)?.avatarUrl;

	useEffect(() => {
		if (currentWorkspace?.id) {
			getAllUsers(currentWorkspace.id);
		}
	}, [currentWorkspace?.id, getAllUsers]);

	const handleSelectAssignee = async (userId: string | null) => {
		if (!userId) {
			await updateTask(taskId, { assigneeId: null, assigneeName: null });
			return;
		}
		const selectedUser = users.find((user) => user.id === userId);
		if (selectedUser && currentTask) {
			await updateTask(taskId, {
				assigneeId: selectedUser.id,
				assigneeName: selectedUser.name,
			});
		}
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					aria-expanded={open}
					className="justify-between w-full md:w-[200px] h-8 md:h-10"
				>
					{assigneeName ? (
						<div className="flex items-center">
							<Avatar className="w-6 h-6 mr-2">
								<AvatarImage src={assigneeAvatar ?? ""} />
								<AvatarFallback>{getInitials(assigneeName)}</AvatarFallback>
							</Avatar>
							<span className="truncate">{assigneeName}</span>
						</div>
					) : (
						<div className="flex items-center">
							<UserSearch className="w-4 h-4 mr-2" />
							<span>Unassigned</span>
						</div>
					)}
					<ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-[200px] p-0">
				<Command>
					<CommandInput placeholder="Search users..." />
					<CommandList>
						<ScrollArea className="h-[300px]">
							<CommandEmpty>No user found.</CommandEmpty>
							<CommandGroup>
								<CommandItem onSelect={() => handleSelectAssignee(null)}>
									<UserSearch className="w-4 h-4 mr-2" />
									<span>Unassign</span>
									<Check
										className={cn(
											"ml-auto h-4 w-4",
											assigneeId === "" ? "opacity-100" : "opacity-0",
										)}
									/>
								</CommandItem>
								{users.map((user) => (
									<CommandItem
										key={user.id}
										onSelect={() => handleSelectAssignee(user.id)}
									>
										<Avatar className="w-6 h-6 mr-2">
											<AvatarImage src={user.avatarUrl ?? ""} />
											<AvatarFallback>{getInitials(user.name)}</AvatarFallback>
										</Avatar>
										<span className="truncate">{user.username}</span>
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
};

export default AssigneeCombobox;
