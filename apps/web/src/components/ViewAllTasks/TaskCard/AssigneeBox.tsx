import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandItem,
} from "@/components/ui/command";
import { useOrganization } from "@clerk/nextjs";

import { useToast } from "@/components/ui/use-toast";
import { client } from "@/lib/client";
import { useTaskStore } from "@/store";
import type { AssigneeBoxProps } from "./TaskContextMenu/interfaces";

export const AssigneeBox = ({ task, closeMenu }: AssigneeBoxProps) => {
	const { toast } = useToast();
	const { updateTask } = useTaskStore((state) => state);
	const taskId = task.id;
	const { memberships } = useOrganization({
		memberships: {
			infinite: true,
			pageSize: 100,
		},
	});
	const users = memberships?.data?.map(
		(membership) => membership.publicUserData,
	);

	if (!users) return <CommandEmpty>No users found</CommandEmpty>;

	const updateAssignee = async (userId: string | undefined) => {
		if (!userId) return;
		closeMenu();
		try {
			const res = await client.task.updateAssignee.$post({
				taskId,
				assigneeId: userId,
			});
			const updatedTask = await res.json();
			updateTask(updatedTask);
		} catch (error) {
			toast({
				title: "Error",
				description: `Failed to update assignee: ${error}`,
			});
		}
	};

	return (
		<Command>
			<CommandGroup>
				{users.map((user) => (
					<CommandItem
						key={user.userId}
						onSelect={() => updateAssignee(user.userId)}
					>
						{user.firstName}
					</CommandItem>
				))}
			</CommandGroup>
		</Command>
	);
};
