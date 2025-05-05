"use client";

import { useTaskDashboard } from "@/hooks/useTaskDashboard";

import ViewAllTasks from "@/components/ViewAllTasks";
import { TaskPageLayout } from "@/components/ViewAllTasks/PageLayout";
import { useGroups } from "@/hooks/useGroups";
import { useFilterStore } from "@/store";

export default function BacklogTasksPage() {
	const { filterTasks } = useFilterStore((state) => state);
	const { loading, authorized, workspace, teamIdentifier, handleDragEnd } =
		useTaskDashboard();

	const { getGroupedColumns } = useGroups((tasks) =>
		filterTasks(tasks).filter((t) => t.status === "backlog"),
	);

	if (!workspace) return null;

	return (
		<TaskPageLayout
			loading={loading}
			authorized={authorized}
			currentWorkspace={workspace}
			teamIdentifier={teamIdentifier}
			handleDragEndAction={handleDragEnd}
			pageTitle="Backlog"
		>
			<ViewAllTasks getGroupedColumns={getGroupedColumns} />
		</TaskPageLayout>
	);
}
