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
import { taskService } from "@/lib/services";
import { useTaskStore } from "@/store";
import { formatStatus } from "@/utils/formatting";
import { TODO } from "@squared/context";
import type { Status } from "@squared/db";

const StatusDropdown = () => {
	const { toast } = useToast();
	const { currentTask, setCurrentTask, updateTask } = useTaskStore(
		(state) => state,
	);

	if (!currentTask) return null;
	const { id: taskId, status: sidebarStatus } = currentTask;

	const handleSelectStatus = (newStatus: Status) => {
		if (newStatus === sidebarStatus || !taskId) return;
		updateItem(newStatus);
	};

	const updateItem = async (newStatus: Status) => {
		try {
			updateTask(
				await taskService.updateTask(TODO, { id: taskId, status: newStatus }),
			);
			setCurrentTask({ ...currentTask, status: newStatus });
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
		>
			<SelectTrigger className="md:grow justify-between hover:cursor-pointer bg-transparent w-fit h-8 md:h-10">
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
