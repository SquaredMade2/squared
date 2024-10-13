// all/page.tsx
"use client";

import { useTaskDashboard } from "@/hooks/useTaskDashboard";
import ViewAllTasks from "@/components/ViewAllTasks";
import HiddenColumns from "@/components/ViewAllTasks/HiddenColumns";
import { useFilterStore, useViewStore } from "@/store";
import { Status } from "@repo/db";
import { TaskPageLayout } from "@/components/ViewAllTasks/PageLayout";
import { statusOptions } from "@/constants/designations";

export default function AllTasksPage() {
	const { filterTasks } = useFilterStore((state) => state);
	const { view, getGridOptions, displayOptions } = useViewStore(
		(state) => state,
	);
	const {
		loading,
		authorized,
		currentWorkspace,
		teamIdentifier,
		handleDragEnd,
		getTasksForStatus,
	} = useTaskDashboard(filterTasks);

	const getHiddenColumns = (): Status[] => {
		const filteredStatuses = statusOptions;

		return filteredStatuses.filter((status) => {
			if (status === Status.archived) return false;
			const tasks = getTasksForStatus(status);
			if (status === Status.done && !displayOptions.showCompletedTasks.show) {
				return tasks;
			}

			return tasks && tasks.length === 0;
		});
	};
	if (!currentWorkspace) return null;
	return (
		<TaskPageLayout
			loading={loading}
			authorized={authorized}
			currentWorkspace={currentWorkspace}
			teamIdentifier={teamIdentifier}
			handleDragEnd={handleDragEnd}
			pageTitle="All Tasks"
		>
			<ViewAllTasks getTasksForStatus={getTasksForStatus} />
			{view === "grid" &&
				!getGridOptions().showEmptyGroups &&
				getHiddenColumns().length >= 1 && (
					<div className="ml-auto">
						<HiddenColumns
							getHiddenColumns={getHiddenColumns}
							getTasksForStatus={getTasksForStatus}
						/>
					</div>
				)}
		</TaskPageLayout>
	);
}
