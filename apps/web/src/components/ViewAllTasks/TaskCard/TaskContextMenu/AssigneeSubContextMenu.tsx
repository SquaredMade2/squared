import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	ContextMenuItem,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
} from "@/components/ui/context-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { taskService } from "@/lib/services";
import { useTaskStore, useUserStore } from "@/store";
import { getInitials } from "@/utils/formatting";
import { TODO } from "@squared/context";
import type { User } from "@squared/db";
import { Check, UserSearch } from "lucide-react";
import { useEffect, useState } from "react";
import type { ContextMenuProps } from "./interfaces";

const AssigneeSubContextMenu = ({ task }: ContextMenuProps) => {
	const { users, user } = useUserStore((state) => state);
	const { updateTask } = useTaskStore((state) => state);
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const taskId = task.id;

	useEffect(() => {
		const foundUser = users.find((user) => user.id === task.assigneeId);
		setCurrentUser(foundUser ?? null);
	}, []);

	const handleSelectAssignee = async (userId: string | null) => {
		if (!userId) {
			return updateTask(
				await taskService.updateTask(TODO, {
					id: taskId,
					updaterId: user?.id || "",
					assigneeId: null,
				}),
			);
		}
		const selectedUser = users.find((user) => user.id === userId);

		if (selectedUser) {
			if (task) {
				updateTask(
					await taskService.updateTask(TODO, {
						id: taskId,
						updaterId: user?.id || "",
						assigneeId: selectedUser.id,
					}),
				);
			}
			// await getTaskEvents(taskId);
		}
	};

	return (
		<ContextMenuSub>
			<ContextMenuSubTrigger>
				<div className="mr-2">
					{!task.assigneeId || !currentUser ? (
						<UserSearch className="size-5 text-[#9597AD]" />
					) : (
						<Avatar className="size-4 text-xxs mr-2 flex">
							<AvatarImage src={currentUser.avatarUrl ?? ""} />
							<AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
						</Avatar>
					)}
				</div>
				Assignee
			</ContextMenuSubTrigger>
			<ContextMenuSubContent>
				<ScrollArea className="max-w-96">
					<ContextMenuItem
						className="flex justify-between"
						onClick={() => handleSelectAssignee(null)}
					>
						<div className="flex">
							<UserSearch className="size-5 mx-1 mr-3" />
							Unassigned
						</div>
						{!task.assigneeId && <Check className="w-4 h-4" />}
					</ContextMenuItem>
					{users
						.sort((a, b) => a.name.localeCompare(b.name))
						.map((user) => {
							return (
								<ContextMenuItem
									key={user.id}
									onClick={() => handleSelectAssignee(user.id)}
									className="flex justify-between"
								>
									<div className="flex">
										<Avatar className="size-6 text-xxs mr-2 flex">
											<AvatarImage src={user.avatarUrl ?? ""} />
											<AvatarFallback>{getInitials(user.name)}</AvatarFallback>
										</Avatar>
										{user.name}
									</div>
									{task.assigneeId === user.id && (
										<Check className="w-4 h-4 ml-2" />
									)}
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
