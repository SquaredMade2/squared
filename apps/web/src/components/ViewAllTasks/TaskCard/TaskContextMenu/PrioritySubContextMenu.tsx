import { PriorityIcon } from "@/components/Icons";
import {
	ContextMenuItem,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
} from "@/components/ui/context-menu";
import { useToast } from "@/components/ui/use-toast";
import { priorityOptions } from "@/lib/constants";
import { taskService } from "@/lib/services";
import { useTaskStore } from "@/store";
import { formatPriority } from "@/utils/formatting";
import { TODO } from "@squared/context";
import type { Priority } from "@squared/db";
import type { ContextMenuProps } from "./interfaces";

const PrioritySubContextMenu = ({ task, type }: ContextMenuProps) => {
	const { toast } = useToast();
	const { updateTask, updateSubtask } = useTaskStore((state) => state);
	const updateItem = async (priority: Priority) => {
		if (task.id !== undefined) {
			try {
				const updatedTask = await taskService.updateTask(TODO, {
					id: task.id,
					priority,
				});

				type === "subtask"
					? updateSubtask(updatedTask)
					: updateTask(updatedTask);
			} catch (error) {
				toast({
					title: "Error updating task",
					description: error instanceof Error && error.message,
				});
			}
		}
	};

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
							onClick={() => updateItem(priority)}
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
