"use client";

import { useEffect, useState } from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "../ui/breadcrumb";
import type { Workspace } from "@repo/db";
import WorkspaceInitials from "@/components/WorkspaceImage";
import Link from "next/link";
import { useTaskStore, useWorkspaceStore } from "@/storeZ";

const TaskCardTop = () => {
	const [currentTaskTitle, setCurrentTaskTitle] = useState("");
	const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(
		null,
	);

	const currentTask = useTaskStore((state) => state.currentTask);
	const workspaceZ = useWorkspaceStore((state) => state.currentWorkspace);
	const allWorkspaces = useWorkspaceStore((state) => state.workspaces);

	const index: number = currentWorkspace
		? allWorkspaces.findIndex((item) => item.id === currentWorkspace.id)
		: -1;

	useEffect(() => {
		if (currentTask) {
			setCurrentTaskTitle(currentTask.title);
		}
	}, [currentTask]);

	useEffect(() => {
		if (workspaceZ) {
			setCurrentWorkspace(workspaceZ);
		}
	}, [workspaceZ]);

	return (
		<>
			<Breadcrumb>
				<BreadcrumbList className="w-full whitespace-nowrap flex items-center gap-2 text-foreground">
					<BreadcrumbItem>
						{currentWorkspace && (
							<Link
								className="flex items-center text-muted-foreground hover:text-foreground"
								href={`/${currentWorkspace.url}`}
							>
								<div className="mt-0.5 rounded">
									<WorkspaceInitials
										workspaceName={currentWorkspace.name}
										backgroundColor={index}
										location="workspaceMenu"
									/>
								</div>
								<p>{currentWorkspace.url}</p>
							</Link>
						)}
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem className="truncate max-w-full">
						{currentTaskTitle}
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
		</>
	);
};

export default TaskCardTop;
