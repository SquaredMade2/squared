import {
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { useToast } from "@/components/ui/use-toast";
import { useUsers } from "@/hooks/useUsers";
import { client } from "@/lib/client";
import { useTaskStore } from "@/store";
import type { AssigneeBoxProps } from "./interfaces";

export const AssigneeBox = ({ task }: AssigneeBoxProps) => {
	const { toast } = useToast();
	const { updateTask } = useTaskStore((state) => state);
	const taskId = task.id;
	const { users } = useUsers();

	const updateAssignee = async (userId: string | null) => {
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
		<>
			<DropdownMenuLabel>Assign to...</DropdownMenuLabel>
			<DropdownMenuSeparator />
			<DropdownMenuGroup className="h-[400px] overflow-y-scroll">
				<DropdownMenuItem key="unassign" onSelect={() => updateAssignee(null)}>
					Unassign
				</DropdownMenuItem>
				{users?.map((user) => (
					<DropdownMenuItem
						key={user.userId}
						onSelect={() => updateAssignee(user.userId as string)}
					>
						{user.firstName}
					</DropdownMenuItem>
				))}
			</DropdownMenuGroup>
		</>
	);
};
