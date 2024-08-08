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
import { menuCheckMark } from "@/components/Svg";
import { handleWorkspaceNameOverflow } from "@/utils/formatting";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";

const styles = {
  main: "xs:pt-2 sm:pt-3 lg:pt-0 z-40 ",
  email: "mb-3 text-muted-foreground text-sm",
  workspacesWrapper: "py-3 border border-red-500",
  workspaces:
    " py-1.5 border text-popover-foreground flex items-center hover:bg-accent rounded text-sm font-medium cursor-default justify-start",
  title:
    "flex items-center text-popover-foreground hover:bg-secondary pr-1.5 py-1.5 rounded",
  titleWrapper: "flex items-center w-full justify-between",
  dropDownWrapper:
    "w-64 border border-border bg-popover z-40 rounded-lg pb-1 absolute transition-all duration-100",
  menuOpen: "transform translate-y-0 scale-100 opacity-100 pointer-events-auto",
  menuClosed: "transform -translate-y-6 scale-95 opacity-0 pointer-events-none",
  menuItemsWrapper: "px-",
  menuItems:
    "px- py-1.5 hover:bg-accent rounded text-sm text-popover-foreground cursor-pointer",
  span: "w-full border-t border-border block pb-1",
  spanTwo: "w-full border-t border-border block my-1",
  cursorDefault: "cursor-default",
  flex: "flex",
  paddingLeft: "pl-1 pb-0.5 ",
};

const WorkSpaceDropDown = () => {
  const dispatch = useAppDispatch();
  const allWorkspaces = useAppSelector((state) => state.taskData.workspaces);

  const user = useAppSelector((state) => state.userSettings.user);
  const currentWorkspace = useAppSelector(
    (state) => state.taskData.currentWorkspace
  );

  useEffect(() => {
    dispatch(getAllWorkspaces());
  }, []);

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
    } catch (error) {}
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center justify-between w-full text-muted-foreground">
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
      <DropdownMenuContent className="w-[240px]">
        {allWorkspaces.map((workspace, index) => (
          <Link
            legacyBehavior
            href={`/workspace/${workspace.url}`}
            className={styles.workspaces}
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
                <div className={styles.paddingLeft}>
                  <span>{menuCheckMark("#575BC7")}</span>
                </div>
              )}
            </DropdownMenuItem>
          </Link>
        ))}

        <DropdownMenuItem
          onClick={() => router.push(workspaceSettings("members"))}
        >
          Invite & manage members
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/join")}>
          Create or join a workspace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WorkSpaceDropDown;
