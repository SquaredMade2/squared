"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	ContextMenuItem,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
} from "@/components/ui/context-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { client } from "@/lib/client";
import { useTaskStore, useUserStore } from "@/store";
import { getInitials } from "@/utils/formatting";
import type { User } from "@squared/db";
import { useMutation } from "@tanstack/react-query";
import { Check, UserSearch } from "lucide-react";
import { useEffect, useState } from "react";
import type { ContextMenuProps } from "./interfaces";

const AssigneeSubContextMenu = ({ task }: ContextMenuProps) => {
	const { users } = useUserStore((state) => state);
	const { updateTask } = useTaskStore((state) => state);
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const taskId = task.id;

	useEffect(() => {
		const foundUser = users.find((user) => user.externalId === task.assigneeId);
		setCurrentUser(foundUser ?? null);
	}, [users, task.assigneeId]);

	const { mutate: updateAssignee } = useMutation({
		mutationKey: ["updateTaskAssignee", taskId],
		mutationFn: async (userId: string | null) => {
			const res = await client.task.updateAssignee.$post({
				taskId,
				assigneeId: userId,
			});
			const updatedTask = await res.json();
			updateTask(updatedTask);
			return updatedTask;
		},
	});

	const handleSelectAssignee = (userId: string | null) => {
		updateAssignee(userId);
	};

	return (
		<ContextMenuSub>
			<ContextMenuSubTrigger>
				<div className="mr-2">
					{!task.assigneeId || !currentUser ? (
						<UserSearch className="size-5 text-[#9597AD]" />
					) : (
						<Avatar className="mr-2 flex size-4 text-xxs">
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
							<UserSearch className="mx-1 mr-3 size-5" />
							Unassigned
						</div>
						{!task.assigneeId && <Check className="h-4 w-4" />}
					</ContextMenuItem>
					{users
						.sort((a, b) => a.name.localeCompare(b.name))
						.map((user) => {
							return (
								<ContextMenuItem
									key={user.externalId}
									onClick={() => handleSelectAssignee(user.externalId)}
									className="flex justify-between"
								>
									<div className="flex">
										<Avatar className="mr-2 flex size-6 text-xxs">
											<AvatarImage src={user.avatarUrl ?? ""} />
											<AvatarFallback>{getInitials(user.name)}</AvatarFallback>
										</Avatar>
										{user.name}
									</div>
									{task.assigneeId === user.externalId && (
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
