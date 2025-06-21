"use client";

import type { Status } from "@squaredmade/db";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@squaredmade/ui/select";
import { toast } from "@squaredmade/ui/toast";
import { useMutation } from "@tanstack/react-query";
import { StatusIcon } from "@/components/Icons";
import { client } from "@/lib/client";
import { statusOptions } from "@/lib/constants";
import { useEventStore, useTaskStore } from "@/store";
import { formatStatus } from "@/utils/formatting";
import { parseError } from "@/utils/parseError";

const StatusDropdown = () => {
	const { currentTask, currentTaskBlockedBy, setCurrentTask, updateTask } =
		useTaskStore((state) => state);
	const { setEvents } = useEventStore((state) => state);

	const taskId = currentTask?.id;
	const sidebarStatus = currentTask?.status;

	const handleSelectStatus = (newStatus: Status) => {
		if (newStatus === sidebarStatus || !taskId) return;
		updateItem(newStatus);
	};

	const { mutate: updateItem } = useMutation({
		mutationFn: async (newStatus: Status) => {
			if (!(currentTask && taskId)) throw new Error("Task not found");
			const res = await client.task.updateStatus
				.$post({
					status: newStatus,
					taskId,
				})
				.then((r) => r.json());
			setCurrentTask({ ...currentTask, status: newStatus });
			updateTask({ ...currentTask, status: newStatus });
			setEvents(
				await client.event.getEvents.$get({ taskId }).then((r) => r.json()),
			);
			return res;
		},
		mutationKey: ["task", "updateStatus", taskId],
		onError: (error) => {
			toast.error("Error updating status", {
				description: parseError(error),
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
						disabled={
							currentTaskBlockedBy.length > 0 &&
							(status === "done" ||
								status === "inReview" ||
								status === "inProgress")
						}
						key={status}
						value={status}
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
