"use client";

import ViewAllTasks from "@/components/ViewAllTasks";
import { TaskPageLayout } from "@/components/ViewAllTasks/PageLayout";
import { useTaskPage } from "@/hooks/useTaskPage";
import { useFilterStore, useTeamStore } from "@/store";

export default function MyAssignedTasksPage() {
	const { currentSprint } = useTeamStore((state) => state);
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
		filterTasks(tasks.filter((t) => t.sprintId === currentSprint?.id)),
	);

	if (!currentWorkspace) return null;

	return (
		<TaskPageLayout
			loading={loading}
			authorized={authorized}
			currentWorkspace={currentWorkspace}
			teamIdentifier={teamIdentifier}
			handleDragEnd={handleDragEnd}
			pageTitle="Assigned Tasks"
		>
			<ViewAllTasks
				getFilteredStatuses={getFilteredStatuses}
				getTasksForStatus={getTasksForStatus}
			/>
		</TaskPageLayout>
	);
}
