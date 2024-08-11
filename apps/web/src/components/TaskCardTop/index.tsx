import Link from "next/link";
import { useAppSelector } from "@/hooks/typeScriptReduxHooks";
import type { RootState } from "@/store";
import WorkspaceInitials from "@/components/WorkspaceImage";
import { ChevronRight } from "lucide-react";

const TaskCardTop = () => {
	const workspace = useAppSelector(
		(state: RootState) => state.taskData.currentWorkspace,
	);
	const allWorkspaces = useAppSelector((state) => state.taskData.workspaces);

	const index: number = allWorkspaces.findIndex(
		(item) => item._id === workspace._id,
	);

	const taskTitle = useAppSelector((state) => state.singleTask.data?.title);

	return (
		<div className="h-10 flex">
			<div className="w-full whitespace-nowrap flex items-center gap-2 text-foreground">
				<Link
					className="flex items-center text-muted-foreground hover:text-foreground"
					href={`/workspace/${workspace.url}`}
				>
					<div className="mt-0.5 rounded">
						<WorkspaceInitials
							workspaceName={workspace.name}
							backgroundColor={index}
							location="workspaceMenu"
						/>
					</div>
					<p>{workspace.url}</p>
				</Link>
				<span className="mt-0.5">
					<ChevronRight className="size-4 stroke-gray-500" />
				</span>
				<div className="w-full truncate">{taskTitle}</div>
			</div>
		</div>
	);
};

export default TaskCardTop;
