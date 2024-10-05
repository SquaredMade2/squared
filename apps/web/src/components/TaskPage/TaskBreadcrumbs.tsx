"use client";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import WorkspaceInitials from "@/components/WorkspaceImage";
import Link from "next/link";
import { useWorkspaceStore } from "@/store";
import type { Task } from "@repo/db";
import { useTaskPageData } from "@/hooks/useTaskPageData";

export const TaskBreadcrumbs = ({ task }: { task: Task }) => {
	const workspace = useTaskPageData().workspace;
	const { workspaces } = useWorkspaceStore((state) => state);

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
