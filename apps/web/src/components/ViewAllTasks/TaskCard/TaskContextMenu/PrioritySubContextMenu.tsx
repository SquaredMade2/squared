import type { ContextMenuProps } from "./interfaces";
import {
	ContextMenuItem,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
} from "@/components/ui/context-menu";
import { priorityOptions } from "@/constants/designations";
import type { Priority } from "@repo/db";
import { useTaskStore } from "@/store";
import { PriorityIcon } from "@/components/Icons";
import { formatPriority } from "@/utils/formatting";

const PrioritySubContextMenu = ({ task }: ContextMenuProps) => {
	const { updateTask } = useTaskStore((state) => state);
	const updateItem = async (priority: Priority) => {
		if (task.id !== undefined) {
			try {
				await updateTask(task.id, { priority });
			} catch {}
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
