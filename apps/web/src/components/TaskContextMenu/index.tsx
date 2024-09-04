import Link from "next/link";
import type { FC } from "react";
import {
	// Calendar, Star, // Not used yet
	Trash,
} from "lucide-react";
import {
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
} from "../ui/context-menu";
import StatusSubContextMenu from "./StatusSubContextMenu";
import AssigneeSubContextMenu from "./AssigneeSubContextMenu";
import PrioritySubContextMenu from "./PrioritySubContextMenu";
import { useAppDispatch, useAppSelector } from "@/hooks/typeScriptReduxHooks";
import type { TaskContextMenuProps } from "@/components/TaskContextMenu/ContextMenu.interfaces";
import LabelSubContextMenu from "./LabelSubContextMenu";
import { deleteTask, getAllTasks } from "@/store/taskData/thunks";
import DateSubContextMenu from "./DateSubContextMenu";
// Will need in future
// import RenameSubContextMenu from "./RenameSubContextMenu";
import { replaceSpacesWithDashes } from "@/utils/formatting";
import { useToast } from "../ui/use-toast";

const TaskContextMenu: FC<TaskContextMenuProps> = ({
	task,
	// Keep below here for future
	setIsCopied,
	copyToClipboard,
}) => {
	const { toast } = useToast();
	const dispatch = useAppDispatch();
	const currentTeam = useAppSelector((state) => state.taskData.currentTeam);

	const title = task !== undefined ? task.title : "";
	const identifier = task?.identifier;

	const alertDeletedTask = () => {
		toast({
			title: "Task Deleted",
			description: `${task.title} has been successfully deleted.`,
		});
	};

	const deleteCurrentTask = async () => {
		await dispatch(deleteTask(task._id));
		await dispatch(getAllTasks(currentTeam));
		alertDeletedTask();
	};

	const gitBranchName = `
	${replaceSpacesWithDashes(
		`${title.toLowerCase()}-${String(identifier).toLowerCase()}`,
	)}`;

	const copyBranchName = () => {
		navigator.clipboard.writeText(gitBranchName.trim());
	};

	return (
		<ContextMenuContent>
			<StatusSubContextMenu task={task} />

			<AssigneeSubContextMenu task={task} />

			<PrioritySubContextMenu task={task} />

			<LabelSubContextMenu task={task} />

			<DateSubContextMenu task={task} />

			{/* Need to make this with a Dialog comp */}
			{/* <RenameSubContextMenu task={task} /> */}

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
				Copy Link
			</ContextMenuItem>

			<ContextMenuItem onClick={copyBranchName}>
				Copy Branch Name
			</ContextMenuItem>

			<ContextMenuItem>
				<Link href={`/tasks/${task._id}`} target="_blank">
					Open in New Tab
				</Link>
			</ContextMenuItem>
			<ContextMenuSeparator />

			<ContextMenuItem onClick={deleteCurrentTask}>
				<div className="mr-2">
					<Trash className="size-4" color="red" />
				</div>
				<label className="text-destructive">Delete</label>
			</ContextMenuItem>
		</ContextMenuContent>
	);
};

export default TaskContextMenu;
