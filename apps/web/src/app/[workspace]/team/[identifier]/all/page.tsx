// all/page.tsx
"use client";

import { useTaskPage } from "@/hooks/useTaskPage";
import ViewAllTasks from "@/components/ViewAllTasks";
import HiddenColumns from "@/components/ViewAllTasks/HiddenColumns";
import { useFilterStore, useViewStore } from "@/store";
import { Status } from "@repo/db";
import { TaskPageLayout } from "@/components/ViewAllTasks/PageLayout";

export default function AllTasksPage() {
	const { filterTasks } = useFilterStore((state) => state);
	const { view, gridViewOptions } = useViewStore((state) => state);
	const {
		loading,
		authorized,
		currentWorkspace,
		teamIdentifier,
		handleDragEnd,
		getFilteredStatuses,
		getTasksForStatus,
	} = useTaskPage(filterTasks);

	const getHiddenColumns = (): Status[] => {
		const filteredStatuses = getFilteredStatuses();
		console.log(filteredStatuses);

		return filteredStatuses.filter((status) => {
			if (status === Status.archived) return false;

			const tasks = getTasksForStatus(status);
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
			<ViewAllTasks
				getFilteredStatuses={getFilteredStatuses}
				getTasksForStatus={getTasksForStatus}
			/>
			{view === "grid" &&
				!gridViewOptions.showEmptyGroups &&
				getHiddenColumns().length >= 1 && (
					<div className="ml-auto">
						<HiddenColumns getHiddenColumns={getHiddenColumns} />
					</div>
				)}
		</TaskPageLayout>
	);
}
