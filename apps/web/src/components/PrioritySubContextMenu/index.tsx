import { PrioritySubContextMenuProps } from "@/app/interfaces/ContextMenu.interfaces";
import {
	ContextMenuItem,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
} from "../ui/context-menu";
import useLogTaskEvent from "@/hooks/useLogTaskEvent";
import { EventType } from "@/interfaces/event.interfaces";
import axios from "axios";
import { getSingleTask } from "@/store/task/thunks";
import { useAppDispatch, useAppSelector } from "@/hooks/typeScriptReduxHooks";
import { setPriority } from "@/store/taskData";
import { priorityOptions } from "@/constants/designations";
import { getAllTasks } from "@/store/taskData/thunks";
import { high, low, medium } from "../Svg";
import { CircleAlert, Ellipsis } from "lucide-react";

const styles = {
	contentWrapper: "",
	centerIcon: "mr-2",
};

const PrioritySubContextMenu: React.FC<PrioritySubContextMenuProps> = ({
	task,
}) => {
	const dispatch = useAppDispatch();

	const currentTeam = useAppSelector((state) => state.taskData.currentTeam);

	const {
		author,
		storeCommonFields,
		storeType,
		storeTaskValue,
		updateTaskValue,
		taskEvent,
	} = useLogTaskEvent();

	const logEvent = (newPriority: string) => {
		storeType(EventType.PriorityUpdated);
		if (task.priority) {
			storeTaskValue(task.priority);
			updateTaskValue(newPriority);
		}
	};

	const updateItem = async (newPriority: string) => {
		if (task._id !== undefined) {
			try {
				await axios.put(
					`${process.env.NEXT_PUBLIC_SERVER}/task/update/${task._id}`,
					{
						priority: newPriority,
					},
				);
				dispatch(getSingleTask(task._id as string));
			} catch (err) {}
		}
	};

	const handleSelectPriority = (newPriority: string) => {
		if (newPriority === task.priority) return;
		if (task._id !== undefined) storeCommonFields(author, task._id);
		logEvent(newPriority);
		updateItem(newPriority);
		if (newPriority === "No priority") {
			dispatch(setPriority(null));
		} else {
			dispatch(setPriority(newPriority));
		}
		dispatch(getAllTasks(currentTeam));
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
				<div className={styles.centerIcon}>{high()}</div>
				Priority
			</ContextMenuSubTrigger>
			<ContextMenuSubContent>
				{priorityOptions.map((priority) => {
					return (
						<ContextMenuItem onClick={() => handleSelectPriority(priority)}>
							<div className={styles.centerIcon}>
								{renderPriorityIcon(priority)}
							</div>
							{priority}
						</ContextMenuItem>
					);
				})}
			</ContextMenuSubContent>
		</ContextMenuSub>
	);
};

export default PrioritySubContextMenu;
