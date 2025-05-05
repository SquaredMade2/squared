// active/page.tsx
"use client";

import ViewAllTasks from "@/components/ViewAllTasks";
import { TaskPageLayout } from "@/components/ViewAllTasks/PageLayout";
import { useGroups } from "@/hooks/useGroups";
import { useTaskDashboard } from "@/hooks/useTaskDashboard";
import { useFilterStore } from "@/store";

export default function ActiveTasksPage() {
	const { filterTasks } = useFilterStore((state) => state);
	const { loading, authorized, workspace, teamIdentifier, handleDragEnd } =
		useTaskDashboard();

	const { getGroupedColumns } = useGroups((tasks) =>
		filterTasks(tasks).filter(
			(t) =>
				t.status === "inProgress" ||
				t.status === "todo" ||
				t.status === "inReview",
		),
	);

	if (!workspace) return null;

	return (
		<TaskPageLayout
			loading={loading}
			authorized={authorized}
			currentWorkspace={workspace}
			teamIdentifier={teamIdentifier}
			handleDragEndAction={handleDragEnd}
			pageTitle="Active Tasks"
		>
			<ViewAllTasks getGroupedColumns={getGroupedColumns} />
		</TaskPageLayout>
	);
}
