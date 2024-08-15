import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/typeScriptReduxHooks";
import { getAllWorkspaces } from "@/store/taskData/thunks";
import WorkspaceInitials from "@/components/WorkspaceImage";
import { Check } from "lucide-react";
import { handleWorkspaceNameOverflow } from "@/utils/formatting";
import Link from "next/link";

const WorkSpaceDropDownContents = () => {
  const dispatch = useAppDispatch();
  const allWorkspaces = useAppSelector((state) => state.taskData.workspaces);
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

  return (
    <div className="w-full flex flex-col">
      {allWorkspaces.map((workspace, index) => (
        <Link
          href={`/workspace/${workspace.url}`}
          className=""
          key={workspace._id}
        >
          <div className="flex items-center p-1 rounded dark:hover:bg-accent hover:bg-muted">
            <WorkspaceInitials
              workspaceName={workspace.name}
              backgroundColor={index}
              location="workspaceList"
            />
            <li>{handleWorkspaceNameOverflow(workspace.name)}</li>
            {workspace.name === currentWorkspace.name && (
              <div className="pl-1 pb-0.5 ml-auto">
                <Check className="text-foreground size-5" />
              </div>
            )}
          </div>
        </Link>
      ))}
      <hr className="my-1" />

      <div
        onClick={() => router.push(workspaceSettings("members"))}
        className="cursor-pointer p-1 rounded dark:hover:bg-accent hover:bg-muted"
      >
        Invite & manage members
      </div>
      <div
        onClick={() => router.push("/join")}
        className="cursor-pointer p-1 rounded dark:hover:bg-accent hover:bg-muted"
      >
        Create or join a workspace
      </div>
    </div>
  );
};

export default WorkSpaceDropDownContents;
