// active/page.tsx
"use client";

import { useTaskPage } from "@/hooks/useTaskPage";
import ViewAllTasks from "@/components/ViewAllTasks";
import { TaskPageLayout } from "@/components/ViewAllTasks/PageLayout";
import { useStore } from "@/hooks/useStore";

export default function ActiveTasksPage() {
	const { filterTasks, currentWorkspace, loading, authorized, currentTeam } =
		useStore();
	const { handleDragEnd, getFilteredStatuses, getTasksForStatus } = useTaskPage(
		(tasks) =>
			filterTasks(tasks).filter(
				(t) =>
					t.status === "inProgress" ||
					t.status === "todo" ||
					t.status === "inReview",
			),
	);
	if (!currentWorkspace || !currentTeam) return null;

	return (
		<TaskPageLayout
			loading={loading}
			authorized={authorized}
			currentWorkspace={currentWorkspace}
			teamIdentifier={currentTeam.identifier}
			handleDragEnd={handleDragEnd}
		>
			<ViewAllTasks
				getFilteredStatuses={getFilteredStatuses}
				getTasksForStatus={getTasksForStatus}
			/>
		</TaskPageLayout>
	);
}
