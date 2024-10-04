"use client";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import WorkspaceInitials from "@/components/WorkspaceImage";
import { useWorkspaceStore } from "@/store";
import type { Task } from "@repo/db";
import { useRouter } from "next/navigation";

export const TaskBreadcrumbs = ({ task }: { task: Task }) => {
	const router = useRouter();
	const allWorkspaces = useWorkspaceStore((state) => state.workspaces);
	const currentWorkspace = useWorkspaceStore((state) => state.currentWorkspace);
	const index: number = currentWorkspace
		? allWorkspaces.findIndex((item) => item.id === currentWorkspace.id)
		: -1;

	return (
		<>
			<Breadcrumb>
				<BreadcrumbList className="w-full whitespace-nowrap flex items-center gap-2 text-foreground">
					<BreadcrumbItem>
						{currentWorkspace && (
							<div
								className="flex items-center text-muted-foreground hover:text-foreground cursor-pointer"
								onClick={() => router.back()}
							>
								<div className="mt-0.5 rounded">
									<WorkspaceInitials
										workspaceName={currentWorkspace.name}
										backgroundColor={index}
										location="workspaceMenu"
									/>
								</div>
								<p>{currentWorkspace.url}</p>
							</div>
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
