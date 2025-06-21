// all/page.tsx
"use client";
import ViewAllTasks from "@/components/ViewAllTasks";
import HiddenColumns from "@/components/ViewAllTasks/HiddenColumns";
import { TaskPageLayout } from "@/components/ViewAllTasks/PageLayout";
import { useGroups } from "@/hooks/useGroups";
import { useTaskDashboard } from "@/hooks/useTaskDashboard";
import { useFilterStore, useViewStore } from "@/store";

export default function AllTasksPage() {
	const { filterTasks } = useFilterStore((state) => state);
	const { view, getGridOptions } = useViewStore((state) => state);
	const { loading, authorized, workspace, teamIdentifier, handleDragEnd } =
		useTaskDashboard();

	const { getGroupedColumns, getHiddenColumns, getTasksForGroup } =
		useGroups(filterTasks);

	if (!workspace) return null;
	return (
		<TaskPageLayout
			authorized={authorized}
			currentWorkspace={workspace}
			handleDragEnd={handleDragEnd}
			loading={loading}
			pageTitle="All Tasks"
			teamIdentifier={teamIdentifier}
		>
			<ViewAllTasks getGroupedColumns={getGroupedColumns} />
			{view === "grid" &&
				!getGridOptions().showEmptyGroups &&
				getHiddenColumns().length > 0 && (
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
