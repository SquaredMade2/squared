// backlog/page.tsx
"use client";

import { useTaskPage } from "@/hooks/useTaskPage";

import ViewAllTasks from "@/components/ViewAllTasks";
import { useFilterStore } from "@/store";
import { TaskPageLayout } from "@/components/ViewAllTasks/PageLayout";

export default function BacklogTasksPage() {
	const { filterTasks } = useFilterStore((state) => state);
	const {
		loading,
		authorized,
		currentWorkspace,
		teamIdentifier,
		handleDragEnd,
		getFilteredStatuses,
		getTasksForStatus,
	} = useTaskPage((tasks) =>
		filterTasks(tasks).filter((t) => t.status === "backlog"),
	);
	if (!currentWorkspace) return null;

	return (
		<TaskPageLayout
			loading={loading}
			authorized={authorized}
			currentWorkspace={currentWorkspace}
			teamIdentifier={teamIdentifier}
			handleDragEnd={handleDragEnd}
			pageTitle="Backlog"
		>
			<ViewAllTasks
				getFilteredStatuses={getFilteredStatuses}
				getTasksForStatus={getTasksForStatus}
				allowedColumns={["backlog"]}
			/>
		</TaskPageLayout>
	);
}
