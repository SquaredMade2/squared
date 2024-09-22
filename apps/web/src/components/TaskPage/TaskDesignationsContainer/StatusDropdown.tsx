"use client";

import {
	Circle,
	CircleCheckBig,
	CircleDashed,
	CircleFadingPlus,
} from "lucide-react";
import { inProgress } from "@/components/Svg";
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
import type { Status } from "@repo/db";
import type { ButtonProps } from "@/components/TaskPage/TaskDesignationsContainer/interfaces";

const StatusDropdown = ({ currentTask }: ButtonProps) => {
	const { toast } = useToast();
	const { updateTask } = useTaskStore((state) => state);
	const taskId = currentTask ? currentTask.id : "";
	const sidebarStatus = currentTask ? currentTask.status : "";

	const showIcon = (name: string | undefined) => {
		switch (name) {
			case "backlog":
				return <CircleDashed className="size-4" />;
			case "todo":
				return <Circle className="size-4" />;
			case "inProgress":
				return inProgress();
			case "inReview":
				return <CircleFadingPlus className="size-4 text-[#7394FF]" />;
			case "done":
				return <CircleCheckBig className="size-4 text-[#7394FF]" />;
		}
	};

	const handleSelectStatus = (newStatus: Status) => {
		if (newStatus === sidebarStatus || !taskId) return;
		updateItem(newStatus);
	};

	const updateItem = async (newStatus: Status) => {
		try {
			await updateTask(taskId, { status: newStatus });
			// await getTaskEvents(taskId);
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
			defaultValue={sidebarStatus}
		>
			<SelectTrigger className="grow justify-between hover:cursor-pointer bg-transparent">
				<SelectValue placeholder="Select status">
					<div className="w-full flex items-center justify-between">
						{showIcon(sidebarStatus)}
						<span className="ml-2">
							{sidebarStatus ? formatStatus(sidebarStatus) : sidebarStatus}
						</span>
					</div>
				</SelectValue>
			</SelectTrigger>
			<SelectContent>
				{statusOptions.map((status) => (
					<SelectItem key={status} value={status}>
						<div className="flex items-center justify-between w-full">
							<div className="flex items-center">
								{showIcon(status)}
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
