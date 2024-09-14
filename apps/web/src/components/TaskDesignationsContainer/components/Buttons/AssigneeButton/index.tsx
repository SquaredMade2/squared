"use client";

import * as React from "react";
import { Check, ChevronsUpDown, UserSearch } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import ProfileImage from "@/components/ProfileImage";
import { useUserStore, useWorkspaceStore } from "@/storeZ";
import type { AssigneeButtonProps } from "./AssigneeButton.interfaces";

export const AssigneeButton = ({
	currentTask,
	handleAssigneeChange,
}: AssigneeButtonProps) => {
	const [open, setOpen] = React.useState(false);
	const [value, setValue] = React.useState("");

	const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace);
	const { getAllUsers, users } = useUserStore((state) => ({
		getAllUsers: state.getAllUsers,
		users: state.users,
	}));
	const taskId = currentTask ? currentTask.id : "";
	const assigneeName = currentTask ? currentTask.assigneeName : "";

	React.useEffect(() => {
		const fetchUsers = async () => {
			if (currentWorkspace?.id) {
				await getAllUsers(currentWorkspace.id);
			}
		};

		fetchUsers();
	}, [currentWorkspace?.id, getAllUsers]);

	const handleSelectAssignee = (userId: string) => {
		const selectedUser = users.find((user) => user.id === userId);
		if (selectedUser) {
			handleAssigneeChange(taskId, selectedUser);
			setValue(userId);
			setOpen(false);
		}
	};

	const handleUnassign = () => {
		handleAssigneeChange(taskId, {
			id: "",
			name: "Unassigned",
			username: "",
			email: "",
			password: "",
			verified: true,
			lastLogin: new Date(),
			onBoarding: false,
			defaultWorkspaceId: "",
			avatarUrl: "",
		});
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-[200px] justify-between"
				>
					{value ? (
						<div className="flex items-center">
							<ProfileImage
								profileName={assigneeName || ""}
								location="assigneeDropdown"
							/>
							<span className="ml-2">{assigneeName}</span>
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
					<CommandEmpty>No user found.</CommandEmpty>
					<CommandGroup>
						<CommandItem onSelect={handleUnassign}>
							<UserSearch className="size-4 mr-2" />
							<span>Unassign</span>
							<Check
								className={cn(
									"ml-auto h-4 w-4",
									value === "" ? "opacity-100" : "opacity-0",
								)}
							/>
						</CommandItem>
						{users.map((user) => (
							<CommandItem
								key={user.id}
								onSelect={() => handleSelectAssignee(user.id)}
							>
								<ProfileImage
									profileName={user.name}
									location="assigneeDropdown"
								/>
								<span className="ml-2">{user.username}</span>
								<Check
									className={cn(
										"ml-auto h-4 w-4",
										value === user.id ? "opacity-100" : "opacity-0",
									)}
								/>
							</CommandItem>
						))}
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

export default AssigneeButton;
