import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/typeScriptReduxHooks";
import { getAllWorkspaces } from "@/store/taskData/thunks";
import WorkspaceInitials from "@/components/WorkspaceImage";
import { Check } from "lucide-react";
import { handleWorkspaceNameOverflow } from "@/utils/formatting";
import { DropdownMenuItem } from "../ui/dropdown-menu";

const WorkSpaceDropDownContents = () => {
	const dispatch = useAppDispatch();
	const allWorkspaces = useAppSelector((state) => state.taskData.workspaces);
	const currentWorkspace = useAppSelector(
		(state) => state.taskData.currentWorkspace,
	);

	useEffect(() => {
		dispatch(getAllWorkspaces());
	}, [dispatch]);

	const router = useRouter();

	const workspaceSettings = (workspaceSettingsOption: string) => {
		return `/settings/${workspaceSettingsOption}`;
	};

	return (
		<div className="w-full flex flex-col">
			{allWorkspaces.map((workspace, index) => (
				<DropdownMenuItem
					key={workspace.id}
					onClick={() => router.push(`/${workspace.url}`)}
					className="cursor-pointer"
				>
					<WorkspaceInitials
						workspaceName={workspace.name}
						backgroundColor={index}
						location="workspaceList"
					/>
					{handleWorkspaceNameOverflow(workspace.name)}
					{workspace.name === currentWorkspace.name && (
						<div className="pl-1 pb-0.5 ml-auto">
							<Check className="text-foreground size-5" />
						</div>
					)}
				</DropdownMenuItem>
			))}
			<hr className="my-1" />

			<DropdownMenuItem
				onClick={() => router.push(workspaceSettings("members"))}
				className="cursor-pointer"
			>
				Invite & manage members
			</DropdownMenuItem>
			<DropdownMenuItem
				onClick={() => router.push("/join")}
				className="cursor-pointer"
			>
				Create or join a workspace
			</DropdownMenuItem>
		</div>
	);
};

export default WorkSpaceDropDownContents;
