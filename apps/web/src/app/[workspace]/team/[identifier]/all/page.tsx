// all/page.tsx
"use client";

import { useTaskPage } from "@/hooks/useTaskPage";
import ViewAllTasks from "@/components/ViewAllTasks";
import UnassignedColumns from "@/components/ViewAllTasks/UnassignedColumns";
import { useViewStore } from "@/store";
import { Status } from "@repo/db";
import { TaskPageLayout } from "@/components/ViewAllTasks/PageLayout";
import { useStore } from "@/hooks/useStore";

export default function AllTasksPage() {
	const { filterTasks, currentWorkspace, loading, authorized, currentTeam } =
		useStore();
	const { view, gridViewOptions } = useViewStore((state) => state);
	const { handleDragEnd, getFilteredStatuses, getTasksForStatus } =
		useTaskPage(filterTasks);

	const getEmptyColumns = (): Status[] => {
		const filteredStatuses = getFilteredStatuses();

		return filteredStatuses.filter((status) => {
			if (status === Status.archived) return false;

			const tasks = getTasksForStatus(status);
			return tasks && tasks.length === 0;
		});
	};
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
			{view === "grid" &&
				!gridViewOptions.showEmptyGroups &&
				getEmptyColumns().length >= 1 && (
					<div className="ml-auto">
						<UnassignedColumns getEmptyColumns={getEmptyColumns} />
					</div>
				)}
		</TaskPageLayout>
	);
}
