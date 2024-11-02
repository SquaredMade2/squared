"use client";

import { useState, useEffect } from "react";
import { statusOptions } from "@/constants/designations";
import { useTaskStore } from "@/store";
import { useToast } from "@/components/ui/use-toast";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { formatStatus } from "@/utils/formatting";
import type { Status } from "@squared/db";
import type { ButtonProps } from "./interfaces";
import { StatusIcon } from "@/components/Icons";

const StatusDropdown = ({ currentTask }: ButtonProps) => {
	const { toast } = useToast();
	const { updateTask, tasks } = useTaskStore((state) => state);
	const [localTask, setLocalTask] = useState(currentTask);

	useEffect(() => {
		if (currentTask) {
			const updatedTask = tasks.find((task) => task.id === currentTask.id);
			setLocalTask(updatedTask || currentTask);
		}
	}, [currentTask, tasks]);

	const taskId = localTask ? localTask.id : "";
	const sidebarStatus = localTask ? localTask.status : "";

	const handleSelectStatus = (newStatus: Status) => {
		if (newStatus === sidebarStatus || !taskId) return;
		updateItem(newStatus);
	};

	const updateItem = async (newStatus: Status) => {
		try {
			await updateTask(taskId, { status: newStatus });
			setLocalTask((prev) => (prev ? { ...prev, status: newStatus } : prev));
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
