import axios from "axios";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/typeScriptReduxHooks";
import { getAllWorkspaces } from "@/store/taskData/thunks";
import { clearUser } from "@/store/userSettings";
import WorkspaceInitials from "@/components/WorkspaceImage";
import ProfileImage from "../ProfileImage";
import { Check } from "lucide-react";
import { handleWorkspaceNameOverflow } from "@/utils/formatting";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";

const WorkSpaceDropDown = () => {
  const dispatch = useAppDispatch();
  const allWorkspaces = useAppSelector((state) => state.taskData.workspaces);
  const user = useAppSelector((state) => state.userSettings.user);
  const currentWorkspace = useAppSelector(
    (state) => state.taskData.currentWorkspace
  );

  useEffect(() => {
    dispatch(getAllWorkspaces());
  }, [dispatch]);

  const router = useRouter();
  const workspaceUrl = currentWorkspace.url;

  const workspaceSettings = (workspaceSettingsOption: string) => {
    return `/workspace/${workspaceUrl}/settings/${workspaceSettingsOption}`;
  };

  const signOutHandler = async () => {
    await signOut({ redirect: false }).then(() => {
      router.push("/login");
    });
  };

  const index: number = allWorkspaces.findIndex(
    (item) => item._id === currentWorkspace._id
  );

  const handleLogout = async (): Promise<void> => {
    await signOutHandler();
    try {
      const response = await axios({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/auth/logout`,
        withCredentials: true,
      });
      dispatch(clearUser());
      router.push(`${process.env.NEXT_PUBLIC_URL}`);
      toast.success(response.data.success);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center justify-between w-full text-muted-foreground mt-2">
        <div className="flex gap-2 items-center ml-2">
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
      <DropdownMenuContent className="w-[265px]">
        {allWorkspaces.map((workspace, index) => (
          <Link
            href={`/workspace/${workspace.url}`}
            className="py-1.5 text-popover-foreground flex items-center hover:bg-accent rounded text-sm font-medium cursor-default justify-start"
            key={workspace._id}
          >
            <DropdownMenuItem>
              <WorkspaceInitials
                workspaceName={workspace.name}
                backgroundColor={index}
                location="workspaceList"
              />
              <li>{handleWorkspaceNameOverflow(workspace.name)}</li>
              {workspace.name === currentWorkspace.name && (
                <div className="pl-1 pb-0.5">
                  <Check className="text-[#575BC7] size-5" />
                </div>
              )}
            </DropdownMenuItem>
          </Link>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push(workspaceSettings("workspace"))}
        >
          Workspace Settings
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(workspaceSettings("members"))}
        >
          Invite & manage members
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/join")}>
          Create or join a workspace
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WorkSpaceDropDown;
