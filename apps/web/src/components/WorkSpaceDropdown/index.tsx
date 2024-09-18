import { useEffect } from "react";
import WorkspaceInitials from "@/components/WorkspaceImage";
import ProfileImage from "../ProfileImage";
import { handleWorkspaceNameOverflow } from "@/utils/formatting";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import {
	useAuthStore,
	useTaskStore,
	useTeamStore,
	useUserStore,
	useWorkspaceStore,
} from "@/store";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import type { Workspace } from "@repo/db";
const WorkSpaceDropDown = () => {
	const {
		currentWorkspace,
		workspaces,
		getAllWorkspaces,
		setCurrentWorkspace,
	} = useWorkspaceStore((state) => state);
	const { getAllTeams } = useTeamStore((state) => state);
	const { getAllTasks } = useTaskStore((state) => state);
	const { getAllUsers } = useUserStore((state) => state);
	const { user } = useAuthStore((state) => state);
	const router = useRouter();

	useEffect(() => {
		user && getAllWorkspaces(user.id);
	}, []);
	const handleWorkspaceClick = async (workspace: Workspace) => {
		setCurrentWorkspace(workspace);
		const teams = await getAllTeams(workspace.id);
		await getAllTasks(teams[0].id);
		await getAllUsers(workspace.id);
		router.push(`/${workspace.url}`);
	};
	const workspaceSettings = (workspaceSettingsOption: string) => {
		return `/settings/${workspaceSettingsOption}`;
	};

	const index: number = workspaces.findIndex(
		(item) => item.id === currentWorkspace?.id,
	);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant={"ghost"}
					className="cursor-pointer w-full flex justify-between px-0  focus:outline-none focus:ring-0"
				>
					<div className="flex">
						<WorkspaceInitials
							workspaceName={currentWorkspace?.name ?? ""}
							backgroundColor={index}
							location="workspaceMenu"
						/>
						{handleWorkspaceNameOverflow(currentWorkspace?.name ?? "")}
					</div>
					{user && (
						<ProfileImage profileName={user.name} location="dropdownMenu" />
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-60">
				{workspaces.map((workspace, index) => (
					<DropdownMenuItem
						key={workspace.id}
						onClick={() => handleWorkspaceClick(workspace)}
						className="cursor-pointer"
					>
						<WorkspaceInitials
							workspaceName={workspace.name}
							backgroundColor={index}
							location="workspaceList"
						/>
						{handleWorkspaceNameOverflow(workspace.name)}
						{workspace.name === currentWorkspace?.name && (
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
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default WorkSpaceDropDown;
