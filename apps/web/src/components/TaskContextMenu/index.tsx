import { useState } from "react";
import {
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuShortcut,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
} from "../ui/context-menu";
import StatusSubContextMenu from "../StatusSubContextMenu";
import AssigneeSubContextMenu from "../AssigneeSubContextMenu";
import PrioritySubContextMenu from "../PrioritySubContextMenu";
import { useAppDispatch, useAppSelector } from "@/hooks/typeScriptReduxHooks";
import { TaskContextMenuProps } from "@/app/interfaces/ContextMenu.interfaces";
import LabelSubContextMenu from "../LabelSubContextMenu";
import { deleteTask, getAllTasks } from "@/store/taskData/thunks";
import {
	// Calendar, Star, // Not used yet
	Trash,
} from "lucide-react";
import DateSubContextMenu from "../DateSubContextMenu";
import Link from "next/link";
import RenameSubContextMenu from "../RenameSubContextMenu";

const TaskContextMenu: React.FC<TaskContextMenuProps> = ({
	task,
	setIsCopied,
	copyToClipboard,
}) => {
	const dispatch = useAppDispatch();

	const [showDropdown, setShowDropdown] = useState(false);

	const theme = useAppSelector((state) => state.userSettings.theme);
	const currentTeam = useAppSelector((state) => state.taskData.currentTeam);
	const styles = {
		contentWrapper: ``,
		centerIcon: `text-danger mr-2`,
	};

	const deleteCurrentTask = async () => {
		console.log("done in deletecurrenttask");
		await dispatch(deleteTask(task._id));
		await dispatch(getAllTasks(currentTeam));
	};

	const handleDateToggle = () => {
		setShowDropdown(!showDropdown);
	};

	const handleDateClickAway = () => {
		setShowDropdown(!showDropdown);
	};

	return (
		<ContextMenuContent className={styles.contentWrapper}>
			<StatusSubContextMenu task={task} />

			<AssigneeSubContextMenu task={task} />

			<PrioritySubContextMenu task={task} />

			<LabelSubContextMenu task={task} />

			<DateSubContextMenu task={task} />

			<RenameSubContextMenu task={task} />

			<ContextMenuSeparator />
			{/*  No Subscribe feature yet
			<ContextMenuItem>
				<div className={styles.centerIcon}>
					<Star className="size-4"/>
				</div>
				Subscribe
			</ContextMenuItem> */}
			{/* <ContextMenuItem>Favorite</ContextMenuItem> */}
			<ContextMenuItem onClick={() => copyToClipboard(task._id)}>
				Copy
			</ContextMenuItem>

			<ContextMenuSeparator />

			<ContextMenuItem onClick={deleteCurrentTask}>
				<div className={styles.centerIcon}>
					<Trash className="size-4" />
				</div>
				Delete
			</ContextMenuItem>
			<ContextMenuItem>
				<Link href={`/tasks/${task._id}`} target="_blank">
					Open in New Tab
				</Link>
			</ContextMenuItem>
		</ContextMenuContent>
	);
};

export default TaskContextMenu;
