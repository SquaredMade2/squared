import { useEffect } from "react";
import { UserSearch } from "lucide-react";
import {
	ContextMenuItem,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
} from "@/components/ui/context-menu";
import type { ContextMenuProps } from "./interfaces";
import { ScrollBar, ScrollArea } from "@/components/ui/scroll-area";
import { useTaskStore, useUserStore, useWorkspaceStore } from "@/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/formatting";

const AssigneeSubContextMenu = ({ task }: ContextMenuProps) => {
	const { users, getAllUsers } = useUserStore((state) => state);
	const { currentWorkspace } = useWorkspaceStore((state) => state);
	const { updateTask } = useTaskStore((state) => state);
	const taskId = task.id;

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
			if (task) {
				await updateTask(taskId, {
					assigneeId: selectedUser.id,
					assigneeName: selectedUser.name,
				});
			}
			// await getTaskEvents(taskId);
		}
	};

	return (
		<ContextMenuSub>
			<ContextMenuSubTrigger>
				<div className="mr-2">
					<UserSearch className="size-5 text-[#9597AD]" />
				</div>
				Assignee
			</ContextMenuSubTrigger>
			<ContextMenuSubContent>
				<ScrollArea className="max-w-96">
					<ContextMenuItem onClick={() => handleSelectAssignee(null)}>
						<UserSearch className="size-4 mx-1 mr-3" />
						Unassign
					</ContextMenuItem>
					{users
						.sort((a, b) => a.name.localeCompare(b.name))
						.map((user) => {
							return (
								<ContextMenuItem
									key={user.id}
									onClick={() => handleSelectAssignee(user.id)}
								>
									<Avatar className="size-6 text-xxs mr-2">
										<AvatarImage src={user.avatarUrl ?? ""} />
										<AvatarFallback>{getInitials(user.name)}</AvatarFallback>
									</Avatar>
									{user.name}
								</ContextMenuItem>
							);
						})}
					<ScrollBar orientation="vertical" />
				</ScrollArea>
			</ContextMenuSubContent>
		</ContextMenuSub>
	);
};

export default AssigneeSubContextMenu;
