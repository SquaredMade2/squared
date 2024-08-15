import Link from "next/link";
import {
	// Calendar, Star, // Not used yet
	Trash,
} from "lucide-react";
import {
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
} from "../ui/context-menu";
import StatusSubContextMenu from "../StatusSubContextMenu";
import AssigneeSubContextMenu from "../AssigneeSubContextMenu";
import PrioritySubContextMenu from "../PrioritySubContextMenu";
import { useAppDispatch, useAppSelector } from "@/hooks/typeScriptReduxHooks";
import { TaskContextMenuProps } from "@/app/interfaces/ContextMenu.interfaces";
import LabelSubContextMenu from "../LabelSubContextMenu";
import { deleteTask, getAllTasks } from "@/store/taskData/thunks";
import DateSubContextMenu from "../DateSubContextMenu";
import RenameSubContextMenu from "../RenameSubContextMenu";

const TaskContextMenu: React.FC<TaskContextMenuProps> = ({
	task,
	// Keep below here for future
	setIsCopied,
	copyToClipboard,
}) => {
	const dispatch = useAppDispatch();
	const currentTeam = useAppSelector((state) => state.taskData.currentTeam);

	const deleteCurrentTask = async () => {
		await dispatch(deleteTask(task._id));
		await dispatch(getAllTasks(currentTeam));
	};

	return (
		<ContextMenuContent>
			<StatusSubContextMenu task={task} />

			<AssigneeSubContextMenu task={task} />

			<PrioritySubContextMenu task={task} />

			<LabelSubContextMenu task={task} />

			<DateSubContextMenu task={task} />

			<RenameSubContextMenu task={task} />

			<ContextMenuSeparator />
			{/*  No Subscribe feature yet
			<ContextMenuItem>
				<div className='text-danger mr-2'>
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
				<div className="text-danger mr-2">
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
