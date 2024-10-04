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
	const { updateTask } = useTaskStore((state) => state);
	const taskId = currentTask ? currentTask.id : "";
	const assigneeName = currentTask ? currentTask.assigneeName : "";
	const assigneeId = currentTask ? currentTask.assigneeId : "";
	const assigneeAvatar = users.find(({ id }) => id === assigneeId)?.avatarUrl;

	useEffect(() => {
		const fetchUsers = async () => {
			if (currentWorkspace?.id) {
				await getAllUsers(currentWorkspace.id);
			}
		};

		fetchUsers();
	}, [currentWorkspace?.id, getAllUsers]);

	const handleSelectAssignee = async (userId: string | null) => {
		if (!userId) {
			updateTask(taskId, { assigneeId: null, assigneeName: null });
			return;
		}
		const selectedUser = users.find((user) => user.id === userId);

		if (selectedUser) {
			if (currentTask) {
				await updateTask(taskId, {
					assigneeId: selectedUser.id,
					assigneeName: selectedUser.name,
				});
			}
			// await getTaskEvents(taskId);
		}
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
											assigneeId === "" ? "opacity-100" : "opacity-0",
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
};

export default AssigneeCombobox;
