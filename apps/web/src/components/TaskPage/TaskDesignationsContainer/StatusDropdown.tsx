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
import { useEventStore, useTaskStore } from "@/store";
import { formatStatus } from "@/utils/formatting";
import { parseError } from "@/utils/parseError";
import type { Status } from "@squared/db";
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
		mutationKey: ["task", "updateStatus", taskId],
		mutationFn: async (newStatus: Status) => {
			const res = await client.task.updateStatus
				.$post({
					taskId,
					status: newStatus,
				})
				.then((res) => res.json());
			setCurrentTask({ ...currentTask, status: newStatus });
			updateTask({ ...currentTask, status: newStatus });
			setEvents(
				await client.event.getEvents.$get({ taskId }).then((res) => res.json()),
			);
			return res;
		},
		onError: (error) => {
			toast({
				title: "Error updating status",
				description: parseError(error),
				variant: "destructive",
			});
		},
	});

	return (
		<Select
			onValueChange={(value) => handleSelectStatus(value as Status)}
			value={sidebarStatus}
		>
			<SelectTrigger className="h-8 w-fit justify-between bg-transparent px-4 py-2 hover:cursor-pointer md:h-10 md:grow">
				<SelectValue placeholder="Select status">
					<div className="flex w-full items-center justify-between">
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
						<div className="flex w-full items-center justify-between">
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
