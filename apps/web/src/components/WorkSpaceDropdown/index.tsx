import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/typeScriptReduxHooks";
import { getAllWorkspaces } from "@/store/taskData/thunks";
import WorkspaceInitials from "@/components/WorkspaceImage";
import ProfileImage from "../ProfileImage";
import { handleWorkspaceNameOverflow } from "@/utils/formatting";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import WorkSpaceDropDownContents from "../WorkSpaceDropDownContents";
import { useToast } from "../ui/use-toast";
const WorkSpaceDropDown = () => {
	const dispatch = useAppDispatch();
	const allWorkspaces = useAppSelector((state) => state.taskData.workspaces);
	const user = useAppSelector((state) => state.userSettings.user);
	const currentWorkspace = useAppSelector(
		(state) => state.taskData.currentWorkspace,
	);

	useEffect(() => {
		dispatch(getAllWorkspaces());
	}, [dispatch]);

	const index: number = allWorkspaces.findIndex(
		(item) => item._id === currentWorkspace._id,
	);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="flex items-center justify-between w-full text-muted-foreground foccus:outline-none">
				<div className="flex gap-2 items-center ">
					<WorkspaceInitials
						workspaceName={currentWorkspace.name}
						backgroundColor={index}
						location="workspaceMenu"
					/>
					{handleWorkspaceNameOverflow(currentWorkspace.name)}
				</div>
				{user && (
					<ProfileImage profileName={user.name} location="dropdownMenu" />
				)}
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-60">
				<WorkSpaceDropDownContents />
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default WorkSpaceDropDown;
