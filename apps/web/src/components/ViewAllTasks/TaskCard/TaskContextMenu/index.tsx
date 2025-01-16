import {
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { useModalStore, useWorkspaceStore } from "@/store";
import { formatUrl, sanitizeBranchName } from "@/utils/formatting";
import {
	// Calendar, Star, // Not used yet
	Trash,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { DeleteTaskAlertDialog } from "../../DeleteTaskAlertDialog";
import AssigneeSubContextMenu from "./AssigneeSubContextMenu";
import DateSubContextMenu from "./DateSubContextMenu";
import LabelSubContextMenu from "./LabelSubContextMenu";
import PrioritySubContextMenu from "./PrioritySubContextMenu";
import StatusSubContextMenu from "./StatusSubContextMenu";
import type { ContextMenuProps } from "./interfaces";

const TaskContextMenu = ({ task }: ContextMenuProps) => {
	const [showConfirmDelete, setShowConfirmDelete] = useState(false);
	const { setShowRename, setRenameData, setShowNewTask, setNewTaskData } =
		useModalStore((state) => state);
	const workspace = useWorkspaceStore((state) => state.workspace);
	const currentWindowOrigin = window.location.origin;

	const title = task !== undefined ? task.title : "";
	const identifier = task?.identifier;

	const gitBranchName = `${sanitizeBranchName(title.toLowerCase())}-${String(identifier).toLowerCase()}`;

	const copyBranchName = () => {
		navigator.clipboard.writeText(gitBranchName.trim());
	};

	const copyTaskIdentifier = () => {
		navigator.clipboard.writeText(identifier);
	};
	const copyTaskUrl = () => {
		navigator.clipboard.writeText(`${currentWindowOrigin}/${workspace?.url}/task/${task.identifier}/${formatUrl(task.title)}`)
	}

	const handleDuplicate = () => {
		setNewTaskData(task);
		setShowNewTask(true);
	};

	return (
		<>
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

				<ContextMenuItem onClick={handleDuplicate}>Duplicate</ContextMenuItem>

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
				<ContextMenuItem onClick={copyTaskUrl}>
					Copy Task Url
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

				<ContextMenuItem onClick={() => setShowConfirmDelete(true)}>
					<div className="mr-2">
						<Trash className="size-4" color="red" />
					</div>
					<span className="text-destructive">Delete</span>
				</ContextMenuItem>
			</ContextMenuContent>

			<DeleteTaskAlertDialog
				task={task}
				showConfirmDelete={showConfirmDelete}
				setShowConfirmDelete={setShowConfirmDelete}
			/>
		</>
	);
};

export default TaskContextMenu;
