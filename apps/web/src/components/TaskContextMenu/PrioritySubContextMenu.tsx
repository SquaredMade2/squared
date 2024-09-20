import type { FC } from "react";
import { CircleAlert, Ellipsis } from "lucide-react";
import type { PrioritySubContextMenuProps } from "@/components/TaskContextMenu/interfaces";
import {
	ContextMenuItem,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
} from "../ui/context-menu";
import { priorityOptions } from "@/constants/designations";
import { high, low, medium } from "../Svg";
import type { Priority } from "@repo/db";
import { useTaskStore } from "@/store";

const PrioritySubContextMenu: FC<PrioritySubContextMenuProps> = ({ task }) => {
	const { updateTask } = useTaskStore((state) => state);
	const updateItem = async (priority: Priority) => {
		if (task.id !== undefined) {
			try {
				await updateTask(task.id, { priority });
			} catch {}
		}
	};

	const renderPriorityIcon = (priority: string) => {
		switch (priority) {
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
				return null;
		}
	};

	return (
		<ContextMenuSub>
			<ContextMenuSubTrigger>
				<div className="mr-2">{high()}</div>
				Priority
			</ContextMenuSubTrigger>
			<ContextMenuSubContent>
				{priorityOptions.map((priority) => {
					return (
						<ContextMenuItem
							key={priority}
							onClick={() => updateItem(priority)}
						>
							<div className="mr-2">{renderPriorityIcon(priority)}</div>
							{priority}
						</ContextMenuItem>
					);
				})}
			</ContextMenuSubContent>
		</ContextMenuSub>
	);
};

export default PrioritySubContextMenu;
