// all/page.tsx
"use client";

import { useTaskDashboard } from "@/hooks/useTaskDashboard";
import ViewAllTasks from "@/components/ViewAllTasks";
import HiddenColumns from "@/components/ViewAllTasks/HiddenColumns";
import { useFilterStore, useViewStore } from "@/store";
import { TaskPageLayout } from "@/components/ViewAllTasks/PageLayout";

export default function AllTasksPage() {
	const { filterTasks } = useFilterStore((state) => state);
	const { view, getGridOptions } = useViewStore((state) => state);
	const {
		loading,
		authorized,
		currentWorkspace,
		teamIdentifier,
		handleDragEnd,
		getGroupColumnTitles,
		getTasksForGroup,
		getHiddenColumns,
	} = useTaskDashboard(filterTasks);

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
				getGroupColumnTitles={getGroupColumnTitles}
				getTasksForGroup={getTasksForGroup}
			/>
			{view === "grid" &&
				!getGridOptions().showEmptyGroups &&
				getHiddenColumns().length >= 1 && (
					<div className="ml-auto">
						<HiddenColumns
							getHiddenColumns={getHiddenColumns}
							getTasksForGroup={getTasksForGroup}
						/>
					</div>
				)}
		</TaskPageLayout>
	);
}
