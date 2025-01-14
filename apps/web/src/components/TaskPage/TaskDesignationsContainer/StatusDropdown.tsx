"use client";

import { StatusIcon } from "@/components/Icons";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { statusOptions } from "@/lib/constants";
import { eventService, taskService } from "@/lib/services";
import { useEventStore, useTaskStore, useUserStore } from "@/store";
import { formatStatus } from "@/utils/formatting";
import { TODO } from "@squared/context";
import type { Status, TaskEvent } from "@squared/db";

const StatusDropdown = () => {
	const { toast } = useToast();
	const {
		currentTask,
		currentTaskBlockedBy,
		currentTaskBlockingIds,
		setCurrentTask,
		updateTask,
	} = useTaskStore((state) => state);
	const { setEvents } = useEventStore((state) => state);
	const user = useUserStore((state) => state.user);

	if (!currentTask) return null;
	const { id: taskId, status: sidebarStatus } = currentTask;

	const handleSelectStatus = (newStatus: Status) => {
		if (newStatus === sidebarStatus || !taskId) return;
		updateItem(newStatus);
	};

	const updateItem = async (newStatus: Status) => {
		try {
			updateTask(
				await taskService.updateTask(TODO, {
					id: taskId,
					updaterId: user?.id || "",
					status: newStatus,
				}),
			);
			setCurrentTask({ ...currentTask, status: newStatus });

			const updatedEvents = await eventService.getTaskEvents(TODO, {
				taskId: taskId,
			});
			// TODO: Will remove type coercion once commits are implemented
			setEvents(updatedEvents as TaskEvent[]);
			if (
				currentTaskBlockingIds.length &&
				(newStatus === "done" ||
					newStatus === "canceled" ||
					newStatus === "archived")
			) {
				taskService.updateBlockedOrBlockingTasks(TODO, {
					taskId,
					updatingIds: [],
					key: "blocking",
				});
			}
		} catch {
			toast({
				title: "Error updating status",
				variant: "destructive",
			});
		}
	};

	return (
		<Select
			onValueChange={(value) => handleSelectStatus(value as Status)}
			value={sidebarStatus}
			disabled={!!currentTaskBlockedBy.length}
		>
			<SelectTrigger className="md:grow justify-between hover:cursor-pointer bg-transparent w-fit h-8 md:h-10 px-4 py-2">
				<SelectValue placeholder="Select status">
					<div className="w-full flex items-center justify-between">
						<StatusIcon status={sidebarStatus || "todo"} />
						<span className="mx-2 text-nowrap">
							{sidebarStatus ? formatStatus(sidebarStatus) : "Select status"}
						</span>
					</div>
				</SelectValue>
			</SelectTrigger>
			<SelectContent>
				{statusOptions.map((status) => (
					<SelectItem key={status} value={status}>
						<div className="flex items-center justify-between w-full">
							<div className="flex items-center">
								<StatusIcon status={status} />
								<span className="ml-2">{formatStatus(status)}</span>
							</div>
						</div>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default StatusDropdown;
