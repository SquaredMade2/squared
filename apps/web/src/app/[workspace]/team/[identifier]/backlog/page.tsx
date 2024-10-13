"use client";

import { useTaskDashboard } from "@/hooks/useTaskDashboard";

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
		getGroupColumnTitles,
		getTasksForGroup,
		getTasksForStatus,
	} = useTaskDashboard((tasks) =>
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
				getTasksForStatus={getTasksForStatus}
				getGroupColumnTitles={getGroupColumnTitles}
				getTasksForGroup={getTasksForGroup}
				allowedColumns={["backlog"]}
			/>
		</TaskPageLayout>
	);
}
