"use client";
import WorkspaceInitials from "@/components/WorkspaceImage";
import {
	useTaskStore,
	useTeamStore,
	useViewStore,
	useWorkspaceStore,
} from "@/store";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@squaredmade/ui/breadcrumb";
import Link from "next/link";

export const TaskBreadcrumbs = () => {
	const { workspaces, workspace } = useWorkspaceStore((state) => state);
	const { currentTask: task } = useTaskStore((state) => state);
	const { team } = useTeamStore((state) => state);
	const { lastVisitedPage } = useViewStore((state) => state);
	const index: number = workspace
		? workspaces.findIndex((item) => item.id === workspace.id)
		: -1;

	return (
		<>
			<Breadcrumb className="ml-4">
				<BreadcrumbList className="w-full whitespace-nowrap flex items-center gap-2 text-foreground">
					<BreadcrumbItem>
						{workspace && (
							<Link
								className="flex items-center text-muted-foreground hover:text-foreground"
								href={`${lastVisitedPage === "inbox" ? "/inbox" : `/${workspace.url}/team/${team?.identifier}/${lastVisitedPage}`}`}
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
						)}
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem className="truncate max-w-full">
						{task?.title ?? ""}
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
		</>
	);
};
