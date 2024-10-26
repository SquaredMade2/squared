"use client";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import WorkspaceInitials from "@/components/WorkspaceImage";
import { useTeamStore, useViewStore, useWorkspaceStore } from "@/store";
import Link from "next/link";
import type { Task, Workspace } from "@squared/db";

export const TaskBreadcrumbs = ({
	task,
	workspace,
}: { task: Task; workspace: Workspace | null }) => {
	const { workspaces } = useWorkspaceStore((state) => state);
	const { currentTeam } = useTeamStore((state) => state);
	const { lastVisitedPage } = useViewStore((state) => state);
	const index: number = workspace
		? workspaces.findIndex((item) => item.id === workspace.id)
		: -1;

	return (
		<>
			<Breadcrumb>
				<BreadcrumbList className="w-full whitespace-nowrap flex items-center gap-2 text-foreground">
					<BreadcrumbItem>
						{workspace && (
							<Link
								className="flex items-center text-muted-foreground hover:text-foreground"
								href={`/${workspace.url}/team/${currentTeam?.identifier}/${lastVisitedPage}`}
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
						{task.title ?? ""}
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
		</>
	);
};
