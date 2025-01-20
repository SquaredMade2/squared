"use client";

import { StatusIcon } from "@/components/Icons";
import {
	ContextMenuItem,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
} from "@squared/ui/context-menu";
import { useToast } from "@squared/ui/hooks";
import { client } from "@/lib/client";
import { statusOptions } from "@/lib/constants";
import { useTaskStore } from "@/store";
import { formatStatus } from "@/utils/formatting";
import type { Status } from "@squared/db";
import { useMutation } from "@tanstack/react-query";
import type { ContextMenuProps } from "./interfaces";

const StatusSubContextMenu = ({ task }: ContextMenuProps) => {
	const { toast } = useToast();
	const { updateTask } = useTaskStore((state) => state);

	const { mutate: updateStatus } = useMutation({
		mutationKey: ["updateTaskStatus", task.id],
		mutationFn: async (status: Status) => {
			const res = await client.task.updateStatus.$post({
				taskId: task.id,
				status,
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
					<StatusIcon status={task.status} />
				</div>
				Status
			</ContextMenuSubTrigger>
			<ContextMenuSubContent>
				{statusOptions.map((status) => {
					return (
						<ContextMenuItem key={status} onClick={() => updateStatus(status)}>
							<div className="mr-2">
								<StatusIcon status={status} />
							</div>
							{formatStatus(status)}
						</ContextMenuItem>
					);
				})}
			</ContextMenuSubContent>
		</ContextMenuSub>
	);
};

export default StatusSubContextMenu;
