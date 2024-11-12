import {
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { useToast } from "@/components/ui/use-toast";
import { taskService } from "@/lib/services";
import { useModalStore, useWorkspaceStore } from "@/store";
// Will need in future
// import RenameSubContextMenu from "./RenameSubContextMenu";
import { formatUrl, sanitizeBranchName } from "@/utils/formatting";
import { TODO } from "@squared/context";
import {
	// Calendar, Star, // Not used yet
	Trash,
} from "lucide-react";
import Link from "next/link";
import AssigneeSubContextMenu from "./AssigneeSubContextMenu";
import DateSubContextMenu from "./DateSubContextMenu";
import LabelSubContextMenu from "./LabelSubContextMenu";
import PrioritySubContextMenu from "./PrioritySubContextMenu";
import StatusSubContextMenu from "./StatusSubContextMenu";
import type { ContextMenuProps } from "./interfaces";

const TaskContextMenu = ({ task }: ContextMenuProps) => {
	const { toast } = useToast();
	const { setShowRename, setRenameData } = useModalStore((state) => state);
	const workspace = useWorkspaceStore((state) => state.workspace);

	const title = task !== undefined ? task.title : "";
	const identifier = task?.identifier;

	const deleteCurrentTask = async () => {
		try {
			await taskService.deleteTask(TODO, { taskId: task.id });
			toast({
				title: "Task Deleted",
				description: `${task.title} has been successfully deleted.`,
			});
		} catch (error) {
			toast({
				title: "Error deleting task",
				description: error instanceof Error && error.message,
			});
		}
	};

	const gitBranchName = `${sanitizeBranchName(title.toLowerCase())}-${String(identifier).toLowerCase()}`;

	const copyBranchName = () => {
		navigator.clipboard.writeText(gitBranchName.trim());
	};

	const copyTaskIdentifier = () => {
		navigator.clipboard.writeText(identifier);
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
			<ContextMenuItem onClick={copyTaskIdentifier}>
				Copy Task ID
			</ContextMenuItem>

			<ContextMenuItem>
				<Link
					href={`/${workspace?.url}/task/${identifier}/${formatUrl(task.title)}`}
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
