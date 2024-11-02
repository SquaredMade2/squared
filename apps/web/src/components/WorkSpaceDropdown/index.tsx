import WorkspaceInitials from "@/components/WorkspaceImage";
import { getInitials, handleWorkspaceNameOverflow } from "@/utils/formatting";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useAuthStore, useWorkspaceStore } from "@/store";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import type { Workspace } from "@/store/workspaces";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
const WorkSpaceDropDown = () => {
	const { currentWorkspace, workspaces, setCurrentWorkspace } =
		useWorkspaceStore((state) => state);
	const { user } = useAuthStore((state) => state);
	const router = useRouter();

	if (!user) return null;
	const handleWorkspaceClick = async (workspace: Workspace) => {
		setCurrentWorkspace(workspace);
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
					className="cursor-pointer w-full flex justify-between focus:outline-none focus:ring-0"
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
						<Avatar className="size-6 text-xxs">
							<AvatarImage src={user.avatarUrl ?? ""} />
							<AvatarFallback>{getInitials(user.name)}</AvatarFallback>
						</Avatar>
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-60 mx-2">
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
