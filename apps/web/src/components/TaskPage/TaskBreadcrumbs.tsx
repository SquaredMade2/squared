"use client";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import WorkspaceInitials from "@/components/WorkspaceImage";
import { useWorkspaceStore } from "@/store";
import type { Task, Workspace } from "@repo/db";
import { useRouter } from "next/navigation";

export const TaskBreadcrumbs = ({
	task,
	workspace,
}: { task: Task; workspace: Workspace | null }) => {
	const router = useRouter();
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
							<div
								className="flex items-center text-muted-foreground hover:text-foreground"
								onClick={() => router.back()}
							>
								<div className="mt-0.5 rounded">
									<WorkspaceInitials
										workspaceName={workspace.name}
										backgroundColor={index}
										location="workspaceMenu"
									/>
								</div>
								<p>{workspace.url}</p>
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
