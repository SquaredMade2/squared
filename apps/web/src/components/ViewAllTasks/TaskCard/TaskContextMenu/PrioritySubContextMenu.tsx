"use client";

import { PriorityIcon } from "@/components/Icons";
import { client } from "@/lib/client";
import { priorityOptions } from "@/lib/constants";
import { useTaskStore } from "@/store";
import { formatPriority } from "@/utils/formatting";
import type { Priority } from "@squared/db";
import {
	ContextMenuItem,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
} from "@squared/ui/context-menu";
import { useToast } from "@squared/ui/hooks";
import { useMutation } from "@tanstack/react-query";
import type { ContextMenuProps } from "./interfaces";

const PrioritySubContextMenu = ({ task }: ContextMenuProps) => {
	const { toast } = useToast();
	const { updateTask } = useTaskStore((state) => state);

	const { mutate: updatePriority } = useMutation({
		mutationKey: ["updateTaskPriority", task.id],
		mutationFn: async (priority: Priority) => {
			const res = await client.task.updatePriority.$post({
				taskId: task.id,
				priority,
			});
			const updatedTask = await res.json();
			updateTask(updatedTask);
			return updatedTask;
		},
		onError: (error) => {
			toast({
				title: "Error updating task",
				description:
					error instanceof Error ? error.message : "An error occurred",
				variant: "destructive",
			});
		},
	});

	return (
		<ContextMenuSub>
			<ContextMenuSubTrigger>
				<div className="mr-2">
					<PriorityIcon priority={task.priority} />
				</div>
				Priority
			</ContextMenuSubTrigger>
			<ContextMenuSubContent>
				{priorityOptions.map((priority) => {
					return (
						<ContextMenuItem
							key={priority}
							onClick={() => updatePriority(priority)}
						>
							<div className="mr-2">
								<PriorityIcon priority={priority} />
							</div>
							{formatPriority(priority)}
						</ContextMenuItem>
					);
				})}
			</ContextMenuSubContent>
		</ContextMenuSub>
	);
};

export default PrioritySubContextMenu;
