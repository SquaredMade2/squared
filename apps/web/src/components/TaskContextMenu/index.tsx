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
import DateDropdown from "../DateDropdown";
import { deleteTask } from "@/store/taskData/thunks";
import { Star, Trash } from "lucide-react";

const TaskContextMenu: React.FC<TaskContextMenuProps> = ({ task }) => {
	const dispatch = useAppDispatch();

	const [showDropdown, setShowDropdown] = useState(false);

	const theme = useAppSelector((state) => state.userSettings.theme);
	const styles = {
		contentWrapper: ``,
		centerIcon: "mr-2",
	};

	const deleteCurrentTask = async () => {
		await dispatch(deleteTask(task._id));
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

			<ContextMenuItem onClick={handleDateToggle}>
				Set due date...
			</ContextMenuItem>
			{showDropdown && (
				<DateDropdown
					location={""}
					handleButtonClick={handleDateToggle}
					handleClickAway={handleDateClickAway}
				/>
			)}
			<ContextMenuItem>Rename...</ContextMenuItem>

			<ContextMenuSeparator />

			<ContextMenuItem>Move</ContextMenuItem>

			<ContextMenuSeparator />

			<ContextMenuItem>
				<div className={styles.centerIcon}>
					<Star />
				</div>
				Subscribe
			</ContextMenuItem>
			<ContextMenuItem>Favorite</ContextMenuItem>
			<ContextMenuItem>Copy</ContextMenuItem>

			<ContextMenuSeparator />

			<ContextMenuItem onClick={deleteCurrentTask}>
				<div className={styles.centerIcon}>
					<Trash />
				</div>
				Delete
			</ContextMenuItem>
			<ContextMenuItem>Open in a new tab</ContextMenuItem>
		</ContextMenuContent>
	);
};

export default TaskContextMenu;
