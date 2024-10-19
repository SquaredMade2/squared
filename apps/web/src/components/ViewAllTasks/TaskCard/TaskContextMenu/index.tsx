import Link from "next/link";
import {
	// Calendar, Star, // Not used yet
	Trash,
} from "lucide-react";
import {
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
} from "@/components/ui/context-menu";
import StatusSubContextMenu from "./StatusSubContextMenu";
import AssigneeSubContextMenu from "./AssigneeSubContextMenu";
import PrioritySubContextMenu from "./PrioritySubContextMenu";
import type { ContextMenuProps } from "./interfaces";
import LabelSubContextMenu from "./LabelSubContextMenu";
import DateSubContextMenu from "./DateSubContextMenu";
// Will need in future
// import RenameSubContextMenu from "./RenameSubContextMenu";
import { sanitizeBranchName } from "@/utils/formatting";
import { useToast } from "@/components/ui/use-toast";
import { useModalStore, useTaskStore, useWorkspaceStore } from "@/store";

const TaskContextMenu = ({ task }: ContextMenuProps) => {
	const { toast } = useToast();
	const { deleteTask } = useTaskStore((state) => state);
	const { setShowRename, setRenameData } = useModalStore((state) => state);
	const { currentWorkspace } = useWorkspaceStore((state) => state);

	const title = task !== undefined ? task.title : "";
	const identifier = task?.identifier;

	const alertDeletedTask = () => {
		toast({
			title: "Task Deleted",
			description: `${task.title} has been successfully deleted.`,
		});
	};

	const deleteCurrentTask = async () => {
		await deleteTask(task.id);
		alertDeletedTask();
	};

	const gitBranchName = `${sanitizeBranchName(title.toLowerCase())}-${String(identifier).toLowerCase()}`;

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
			<ContextMenuItem
				onClick={() => {
					setRenameData(task);
					setShowRename(true);
				}}
			>
				Rename Task
			</ContextMenuItem>

			<ContextMenuSeparator />
			{/*  No Subscribe feature yet
			<ContextMenuItem>
				<div className='text-danger mr-2'>
					<Star className="size-4"/>
				</div>
				Subscribe
			</ContextMenuItem> */}
			{/* <ContextMenuItem>Favorite</ContextMenuItem> */}
			{/* <ContextMenuItem onClick={() => copyToClipboard(task.id)}>
				Copy Link
			</ContextMenuItem> */}

			<ContextMenuItem onClick={copyBranchName}>
				Copy Branch Name
			</ContextMenuItem>

			<ContextMenuItem>
				<Link
					href={`${currentWorkspace?.url}/tasks/${task.id}`}
					target="_blank"
				>
					Open in New Tab
				</Link>
			</ContextMenuItem>
			<ContextMenuSeparator />

			<ContextMenuItem onClick={deleteCurrentTask}>
				<div className="mr-2">
					<Trash className="size-4" color="red" />
				</div>
				<span className="text-destructive">Delete</span>
			</ContextMenuItem>
		</ContextMenuContent>
	);
};

export default TaskContextMenu;
