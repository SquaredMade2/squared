import type { FC } from "react";
import axios from "axios";
import { CircleAlert, Ellipsis } from "lucide-react";
import type { PrioritySubContextMenuProps } from "@/components/TaskContextMenu/ContextMenu.interfaces";
import {
	ContextMenuItem,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
} from "../ui/context-menu";
import useLogTaskEvent from "@/hooks/useLogTaskEvent";
import { EventType } from "@/interfaces/event.interfaces";
import { getSingleTask } from "@/store/task/thunks";
import { useAppDispatch, useAppSelector } from "@/hooks/typeScriptReduxHooks";
import { setPriority } from "@/store/taskData";
import { priorityOptions } from "@/constants/designations";
import { getAllTasks } from "@/store/taskData/thunks";
import { high, low, medium } from "../Svg";
import type { Priority } from "@repo/db";

const PrioritySubContextMenu: FC<PrioritySubContextMenuProps> = ({ task }) => {
	const dispatch = useAppDispatch();

	const currentTeam = useAppSelector((state) => state.taskData.currentTeam);

	const {
		author,
		storeCommonFields,
		storeType,
		storeTaskValue,
		updateTaskValue,
	} = useLogTaskEvent();

	const logEvent = (newPriority: string) => {
		storeType(EventType.PriorityUpdated);
		if (task.priority) {
			storeTaskValue(task.priority);
			updateTaskValue(newPriority);
		}
	};

	const updateItem = async (newPriority: string) => {
		if (task.id !== undefined) {
			try {
				await axios.put(
					`${process.env.NEXT_PUBLIC_SERVER}/task/update/${task.id}`,
					{
						priority: newPriority,
					},
				);
				dispatch(getSingleTask(task.id as string));
			} catch (err) {}
		}
	};

	const handleSelectPriority = async (newPriority: Priority) => {
		if (newPriority === task.priority) return;
		if (task.id !== undefined) storeCommonFields(author, task.id);
		logEvent(newPriority);
		updateItem(newPriority);
		if (newPriority === "noPriority") {
			await dispatch(setPriority("noPriority"));
		} else {
			await dispatch(setPriority(newPriority));
		}
		await dispatch(getAllTasks(currentTeam));
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
							onClick={() => handleSelectPriority(priority)}
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
