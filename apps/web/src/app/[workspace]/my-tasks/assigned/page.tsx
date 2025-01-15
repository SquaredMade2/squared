"use client";

import ViewAllTasks from "@/components/ViewAllTasks";
import { TaskPageLayout } from "@/components/ViewAllTasks/PageLayout";
import { useGroups } from "@/hooks/useGroups";
import { useTaskDashboard } from "@/hooks/useTaskDashboard";
import { useFilterStore, useUserStore } from "@/store";

export default function MyAssignedTasksPage() {
	const user = useUserStore((state) => state.user);
	const { filterTasks } = useFilterStore((state) => state);

	const { loading, authorized, workspace, teamIdentifier, handleDragEnd } =
		useTaskDashboard();

	const { getGroupedColumns } = useGroups((tasks) =>
		filterTasks(tasks.filter((t) => t.assigneeId === user?.externalId)),
	);

	if (!workspace) return null;

	return (
		<TaskPageLayout
			loading={loading}
			authorized={authorized}
			currentWorkspace={workspace}
			teamIdentifier={teamIdentifier}
			handleDragEnd={handleDragEnd}
			pageTitle="Assigned Tasks"
		>
			<ViewAllTasks getGroupedColumns={getGroupedColumns} />
		</TaskPageLayout>
	);
}
