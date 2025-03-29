"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	ContextMenuItem,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
} from "@/components/ui/context-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useUsers } from "@/hooks/useUsers";
import { client } from "@/lib/client";
import { useTaskStore } from "@/store";
import { formatName, getInitials } from "@/utils/formatting";
import { Check, UserSearch } from "@squaredmade/icons";
import { useMutation } from "@tanstack/react-query";
import type { ContextMenuProps } from "./interfaces";

const AssigneeSubContextMenu = ({ task }: ContextMenuProps) => {
	const { user, users } = useUsers();
	const { updateTask } = useTaskStore((state) => state);
	const taskId = task.id;
	const assignedUser = users?.find((u) => u.userId === task.assigneeId);

	const { mutate: updateAssignee } = useMutation({
		mutationKey: ["task", "updateAssignee", taskId],
		mutationFn: async (userId?: string | null) => {
			if (!taskId || userId === undefined)
				throw new Error("Task or user not found");
			const res = await client.task.updateAssignee.$post({
				taskId,
				assigneeId: userId,
			});
			const updatedTask = await res.json();
			updateTask(updatedTask);
			return updatedTask;
		},
	});

	const handleSelectAssignee = (userId?: string | null) => {
		updateAssignee(userId);
	};

	return (
		<ContextMenuSub>
			<ContextMenuSubTrigger>
				<div className="mr-2">
					{!task.assigneeId ? (
						<UserSearch className="size-5 text-[#9597AD]" />
					) : (
						<Avatar className="mr-2 flex size-4 text-xxs">
							<AvatarImage src={assignedUser?.imageUrl ?? ""} />
							<AvatarFallback>{getInitials(user?.fullName)}</AvatarFallback>
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
							<UserSearch className="mx-1 mr-3 size-5" />
							Unassigned
						</div>
						{!task.assigneeId && <Check className="h-4 w-4" />}
					</ContextMenuItem>
					{users
						?.sort((a, b) => formatName(a).localeCompare(formatName(b)))
						.map((user) => {
							return (
								<ContextMenuItem
									key={user.userId}
									onClick={() => handleSelectAssignee(user.userId)}
									className="flex justify-between"
								>
									<div className="flex">
										<Avatar className="mr-2 flex size-6 text-xxs">
											<AvatarImage src={user.imageUrl ?? ""} />
											<AvatarFallback>
												{getInitials(formatName(user))}
											</AvatarFallback>
										</Avatar>
										{formatName(user)}
									</div>
									{task.assigneeId === user.userId && (
										<Check className="ml-2 h-4 w-4" />
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
