import { useEffect, useState } from "react";
import { UserSearch } from "lucide-react";
import ProfileImage from "../ProfileImage";
import { useTheme } from "next-themes";
import type { AssigneeDropdownProps } from "./AssigneeDropdown.interfaces";
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@/components/ui/popover";
import {
	Command,
	CommandInput,
	CommandList,
	CommandItem,
	CommandEmpty,
} from "@/components/ui/command";
import { useUserStore, useWorkspaceStore } from "@/storeZ";
import type { User } from "@repo/db";

export const AssigneeDropdown = ({
	taskId,
	location,
	setShowAssigneeDropdown,
	handleAssigneeChange,
}: AssigneeDropdownProps) => {
	const [query, setQuery] = useState("");
	const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace);
	const { getAllUsers, users } = useUserStore((state) => ({
		getAllUsers: state.getAllUsers,
		users: state.users,
	}));

	useEffect(() => {
		const fetchUsers = async () => {
			if (currentWorkspace?.id) {
				await getAllUsers(currentWorkspace.id);
			}
		};

		fetchUsers();
	}, [currentWorkspace?.id, getAllUsers]);

	const handleSelectAssignee = (user: User) => {
		handleAssigneeChange(taskId, user);
		setShowAssigneeDropdown(false);
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
		setShowAssigneeDropdown(false);
	};

	const containerClassNames = () => {
		switch (location) {
			case "Grid":
				return "absolute top-10 right-1 flex flex-col bg-card border border-border rounded-lg overflow-hidden z-30 w-60 h-auto";
			case "Dashboard":
				return "absolute bg-card border border-border rounded-lg overflow-hidden z-30 w-60 h-auto";
			case "taskPage":
				return "flex flex-col bg-card border border-border rounded-lg overflow-hidden z-30 w-60 h-auto";
			default:
				return "";
		}
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<button className="flex items-center space-x-2" type="button">
					<UserSearch className="size-4" />
					<span>Assign to...</span>
				</button>
			</PopoverTrigger>
			<PopoverContent className={containerClassNames()}>
				<Command>
					<CommandInput
						placeholder="Search users..."
						onValueChange={(value) => setQuery(value)}
					/>
					<CommandList>
						<CommandItem
							onSelect={handleUnassign}
							className="flex items-center space-x-2"
						>
							<UserSearch className="size-4 mr-2" />
							<span>Unassign</span>
						</CommandItem>
						<CommandEmpty>No results found.</CommandEmpty>
						{users.map((user) => (
							<CommandItem
								key={user.id}
								onSelect={() => handleSelectAssignee(user)}
								className="flex items-center space-x-2"
							>
								<ProfileImage
									profileName={user.name}
									location="assigneeDropdown"
								/>
								<span>{user.username}</span>
							</CommandItem>
						))}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};

export default AssigneeDropdown;
