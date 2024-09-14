"use client";

import { priorityOptions } from "@/constants/designations";
import { useToast } from "@/components/ui/use-toast";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { CircleAlert, Ellipsis } from "lucide-react";
import { high, medium, low } from "@/components/Svg";
import { useTaskStore, useActivityStore } from "@/storeZ";
import type { Priority } from "@repo/db";
import type { ButtonProps } from "@/components/TaskDesignationsContainer/interfaces";

const PriorityDropdown = ({ currentTask }: ButtonProps) => {
	const { toast } = useToast();
	const { updateTask } = useTaskStore((state) => state);
	const { getTaskEvents } = useActivityStore((state) => state);
	const sidebarPriority = currentTask ? currentTask?.priority : "";
	const taskId = currentTask ? currentTask.id : "";

	const showIcon = (name: string) => {
		switch (name) {
			case "No priority":
				return <Ellipsis className="size-4" />;
			case "Urgent":
				return <CircleAlert className="size-4 fill-destructive" />;
			case "High":
				return high();
			case "Medium":
				return medium();
			case "Low":
				return low();
			default:
				return <Ellipsis className="size-4" />;
		}
	};

	const handleSelectPriority = (newPriority: Priority) => {
		if (newPriority === sidebarPriority || !taskId) return;
		updateItem(newPriority);
	};

	const updateItem = async (newPriority: Priority) => {
		try {
			await updateTask(taskId, { priority: newPriority });
			// await getTaskEvents(taskId);
		} catch (err) {
			toast({
				title: "Error updating priority",
				variant: "destructive",
			});
		}
	};

	return (
		<Select
			onValueChange={(value) => handleSelectPriority(value as Priority)}
			defaultValue={sidebarPriority}
		>
			<SelectTrigger className="grow flex flex-row items-center border-[0.8px] border-border text-card-foreground hover:cursor-pointer bg-transparent">
				<SelectValue placeholder="Select priority">
					<div className="w-full flex items-center justify-between">
						<div className="w-4 h-4 mr-2">
							{showIcon(sidebarPriority || "No priority")}
						</div>
						<span className="text-sm font-semibold text-card-foreground">
							{sidebarPriority || "No priority"}
						</span>
					</div>
				</SelectValue>
			</SelectTrigger>
			<SelectContent>
				{priorityOptions.map((priority) => (
					<SelectItem key={priority} value={priority}>
						<div className="flex items-center justify-between w-full">
							<div className="flex items-center">
								{showIcon(priority)}
								<span className="ml-2">{priority}</span>
							</div>
						</div>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default PriorityDropdown;
