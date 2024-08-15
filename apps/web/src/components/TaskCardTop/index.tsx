import { useAppSelector } from "@/hooks/typeScriptReduxHooks";
import type { RootState } from "@/store";
import WorkspaceInitials from "@/components/WorkspaceImage";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "../ui/breadcrumb";

const TaskCardTop = () => {
  const workspace = useAppSelector(
    (state: RootState) => state.taskData.currentWorkspace
  );
  const allWorkspaces = useAppSelector((state) => state.taskData.workspaces);

	const index: number = allWorkspaces.findIndex(
		(item) => item._id === workspace._id,
	);

  const taskTitle = useAppSelector((state) => state.singleTask.data?.title);

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList className="w-full whitespace-nowrap flex items-center gap-2 text-foreground">
          <BreadcrumbItem>
            <BreadcrumbLink
              className="flex items-center text-muted-foreground hover:text-foreground"
              href={`/${workspace.url}`}
            >
              <div className="mt-0.5 rounded">
                <WorkspaceInitials
                  workspaceName={workspace.name}
                  backgroundColor={index}
                  location="workspaceMenu"
                />
              </div>
              <p>{workspace.url}</p>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className="truncate max-w-full">
            {taskTitle}
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
};

export default TaskCardTop;
