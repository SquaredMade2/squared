import Link from "next/link";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { handleWorkspaceNameOverflow } from "@/utils/formatting";
import { ChevronRight, X } from "lucide-react";
import WorkspaceInitials from "@/components/WorkspaceImage";
import type { ViewNewTopNavBarProps } from "@/components/ViewNewTopNavBar/ViewNewTopNavBar.interfaces";

const ViewNewTopNavBar = ({ showFilterSaveForm }: ViewNewTopNavBarProps) => {
  const allWorkspaces = useSelector(
    (state: RootState) => state.taskData.workspaces
  );
  const currentWorkspace = useSelector(
    (state: RootState) => state.taskData.currentWorkspace
  );
  const index: number = allWorkspaces.findIndex(
    (item) => item._id === currentWorkspace._id
  );

  return (
    <div className="max-w-screen">
      <p>navbar</p>
      {!showFilterSaveForm && (
        <div className="bg-background mt-5 flex flex-row w-full items-center space-x-4">
          <Link href="/views">
            <X className="text-[#bababa] size-5" />
          </Link>
          <div className="flex flex-row items-center rounded-lg text-foreground">
            <WorkspaceInitials
              workspaceName={currentWorkspace.name}
              backgroundColor={index}
              location="workspaceMenu"
            />
            {handleWorkspaceNameOverflow(currentWorkspace.name)}
          </div>
          <div>
            <ChevronRight className="size-4 stroke-gray-500" />
          </div>
          <Link href="/views">
            <div className="text-gray-300">Views</div>
          </Link>
          <div>
            <ChevronRight className="size-4 stroke-gray-500" />
          </div>
          <div className="text-gray-300">New View</div>
        </div>
      )}
    </div>
  );
};

export default ViewNewTopNavBar;
