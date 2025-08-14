"use client";

import type { Priority } from "@squaredmade/db";
import { toast } from "@squaredmade/ui/toast";
import { useMutation } from "@tanstack/react-query";
import { PriorityIcon } from "@/components/Icons";
import {
	ContextMenuItem,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
} from "@/components/ui/context-menu";
import { client } from "@/lib/client";
import { priorityOptions } from "@/lib/constants";
import { useTaskStore } from "@/store";
import { formatPriority } from "@/utils/formatting";
import type { ContextMenuProps } from "./interfaces";

const PrioritySubContextMenu = ({ task }: ContextMenuProps) => {
	const { updateTask } = useTaskStore((state) => state);

	const { mutate: updatePriority } = useMutation({
		mutationFn: async (priority: Priority) => {
			const res = await client.task.updatePriority.$post({
				priority,
				taskId: task.id,
			});
			const updatedTask = await res.json();
			updateTask(updatedTask);
			return updatedTask;
		},
		mutationKey: ["task", "updatePriority", task.id],
		onError: (error) => {
			toast.error("Error updating task", {
				description:
					error instanceof Error ? error.message : "An error occurred",
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
