import { useEffect, type FC } from "react";
import { UserSearch } from "lucide-react";
import {
	ContextMenuItem,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
} from "@/components/ui/context-menu";
import ProfileImage from "@/components/ProfileImage";
import type { AssigneeSubContextMenuProps } from "./interfaces";
import { ScrollBar, ScrollArea } from "@/components/ui/scroll-area";
import { useTaskStore, useUserStore, useWorkspaceStore } from "@/store";

const AssigneeSubContextMenu: FC<AssigneeSubContextMenuProps> = ({ task }) => {
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
					<ContextMenuItem
						className="w-40"
						onClick={() => handleSelectAssignee(null)}
					>
						Unassign
					</ContextMenuItem>

					{users.map((user) => {
						return (
							<ContextMenuItem
								key={user.id}
								onClick={() => handleSelectAssignee(user.id)}
							>
								<ProfileImage
									profileName={user.username ?? ""}
									location={"contextMenu"}
								/>
								{user.username}
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
