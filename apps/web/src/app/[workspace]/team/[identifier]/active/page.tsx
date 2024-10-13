// active/page.tsx
"use client";

import { useTaskDashboard } from "@/hooks/useTaskDashboard";
import ViewAllTasks from "@/components/ViewAllTasks";
import { useFilterStore } from "@/store";
import { TaskPageLayout } from "@/components/ViewAllTasks/PageLayout";
import { Status } from "@repo/db";

export default function ActiveTasksPage() {
	const { filterTasks } = useFilterStore((state) => state);
	const {
		loading,
		authorized,
		currentWorkspace,
		teamIdentifier,
		handleDragEnd,
		getFilteredStatuses,
		getTasksForStatus,
	} = useTaskDashboard((tasks) =>
		filterTasks(tasks).filter(
			(t) =>
				t.status === "inProgress" ||
				t.status === "todo" ||
				t.status === "inReview",
		),
	);
	if (!currentWorkspace) return null;
	const allowedColumns = [Status.todo, Status.inProgress, Status.inReview];

	return (
		<TaskPageLayout
			loading={loading}
			authorized={authorized}
			currentWorkspace={currentWorkspace}
			teamIdentifier={teamIdentifier}
			handleDragEnd={handleDragEnd}
			pageTitle="Active Tasks"
		>
			<ViewAllTasks
				getFilteredStatuses={getFilteredStatuses}
				getTasksForStatus={getTasksForStatus}
				allowedColumns={allowedColumns}
			/>
		</TaskPageLayout>
	);
}
