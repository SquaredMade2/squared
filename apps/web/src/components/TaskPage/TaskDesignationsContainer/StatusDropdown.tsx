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
import { client } from "@/lib/client";
import { statusOptions } from "@/lib/constants";
import { eventService } from "@/lib/services";
import { useEventStore, useTaskStore } from "@/store";
import { formatStatus } from "@/utils/formatting";
import { TODO } from "@squared/context";
import type { Status, TaskEvent } from "@squared/db";
import { useMutation } from "@tanstack/react-query";

const StatusDropdown = () => {
	const { toast } = useToast();
	const { currentTask, currentTaskBlockedBy, setCurrentTask, updateTask } =
		useTaskStore((state) => state);
	const { setEvents } = useEventStore((state) => state);

	if (!currentTask) return null;
	const { id: taskId, status: sidebarStatus } = currentTask;

	const handleSelectStatus = (newStatus: Status) => {
		if (newStatus === sidebarStatus || !taskId) return;
		updateItem(newStatus);
	};

	const { mutate: updateItem } = useMutation({
		mutationKey: ["updateTask", taskId],
		mutationFn: async (newStatus: Status) => {
			const res = await client.task.updateStatus
				.$post({
					taskId,
					status: newStatus,
				})
				.then((res) => res.json());
			setCurrentTask({ ...currentTask, status: newStatus });
			updateTask({ ...currentTask, status: newStatus });
			const updatedEvents = await eventService.getTaskEvents(TODO, {
				taskId: taskId,
			});
			// TODO: Will remove type coercion once commits are implemented
			setEvents(updatedEvents as TaskEvent[]);
			return res;
		},
		onError: (error) => {
			toast({
				title: "Error updating status",
				description: error.message,
				variant: "destructive",
			});
		},
	});

	return (
		<Select
			onValueChange={(value) => handleSelectStatus(value as Status)}
			value={sidebarStatus}
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
					<SelectItem
						key={status}
						value={status}
						disabled={
							!!currentTaskBlockedBy.length &&
							(status === "done" ||
								status === "inReview" ||
								status === "inProgress")
						}
					>
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
