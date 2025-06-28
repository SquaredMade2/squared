import { useOrganization } from "@clerk/nextjs";
import {
	// Calendar, Star, // Not used yet
	Trash,
} from "@squaredmade/icons";
import { toast } from "@squaredmade/ui/toast";
import Link from "next/link";
import { useState } from "react";
import {
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { config } from "@/config";
import { useTeams } from "@/hooks/useTeams";
import { useModalStore } from "@/store";
import { formatUrl, sanitizeBranchName } from "@/utils/formatting";
import { DeleteTaskAlertDialog } from "../../DeleteTaskAlertDialog";
import AssigneeSubContextMenu from "./AssigneeSubContextMenu";
import DateSubContextMenu from "./DateSubContextMenu";
import type { ContextMenuProps } from "./interfaces";
import LabelSubContextMenu from "./LabelSubContextMenu";
import PrioritySubContextMenu from "./PrioritySubContextMenu";
import SprintSubContextMenu from "./SprintSubContextMenu";
import StatusSubContextMenu from "./StatusSubContextMenu";

const TaskContextMenu = ({ task }: ContextMenuProps) => {
	const [showConfirmDelete, setShowConfirmDelete] = useState(false);
	const { setShowRename, setRenameData, setShowNewTask, setNewTaskData } =
		useModalStore((state) => state);
	const { organization } = useOrganization();
	const { team } = useTeams();
	const title = task !== undefined ? task.title : "";
	const identifier = task?.identifier;

	const gitBranchName = `${sanitizeBranchName(title.toLowerCase())}-${String(identifier).toLowerCase()}`;

	const copyBranchName = () => {
		navigator.clipboard.writeText(gitBranchName.trim());
	};

	const copyTaskIdentifier = () => {
		navigator.clipboard.writeText(identifier);
	};
	const copyTaskUrl = async () => {
		await navigator.clipboard.writeText(
			`${config.NEXT_PUBLIC_URL}/${organization?.slug}/task/${task.identifier}/${formatUrl(task.title)}`,
		);
		toast.success("Task link copied to clipboard", {
			description: "Paste it wherever you like",
		});
	};

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

				{team?.sprintsEnabled && <SprintSubContextMenu task={task} />}
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
				<ContextMenuItem onClick={copyTaskUrl}>Copy Task Url</ContextMenuItem>

				<ContextMenuItem>
					<Link
						href={`/${organization?.slug}/task/${identifier}/${formatUrl(task.title)}`}
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
				setShowConfirmDelete={setShowConfirmDelete}
				showConfirmDelete={showConfirmDelete}
				task={task}
			/>
		</>
	);
};

export default TaskContextMenu;
