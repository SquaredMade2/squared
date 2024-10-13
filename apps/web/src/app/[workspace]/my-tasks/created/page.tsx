"use client";

import ViewAllTasks from "@/components/ViewAllTasks";
import { TaskPageLayout } from "@/components/ViewAllTasks/PageLayout";
import { useTaskDashboard } from "@/hooks/useTaskDashboard";
import { useAuthStore, useFilterStore } from "@/store";

export default function MyCreatedTasksPage() {
	const { user } = useAuthStore((state) => state);
	const { filterTasks } = useFilterStore((state) => state);

	const {
		loading,
		authorized,
		currentWorkspace,
		teamIdentifier,
		handleDragEnd,
		getTasksForStatus,
	} = useTaskDashboard((tasks) =>
		filterTasks(tasks.filter((t) => t.authorId === user?.id)),
	);

	if (!currentWorkspace) return null;

	return (
		<TaskPageLayout
			loading={loading}
			authorized={authorized}
			currentWorkspace={currentWorkspace}
			teamIdentifier={teamIdentifier}
			handleDragEnd={handleDragEnd}
			pageTitle="Created Tasks"
		>
			<ViewAllTasks getTasksForStatus={getTasksForStatus} />
		</TaskPageLayout>
	);
}
