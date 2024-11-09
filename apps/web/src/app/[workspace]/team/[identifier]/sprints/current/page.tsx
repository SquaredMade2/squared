"use client";

import ViewAllTasks from "@/components/ViewAllTasks";
import HiddenColumns from "@/components/ViewAllTasks/HiddenColumns";
import { TaskPageLayout } from "@/components/ViewAllTasks/PageLayout";
import { useGroups } from "@/hooks/useGroups";
import { useSprints } from "@/hooks/useSprints";
import { useTaskDashboard } from "@/hooks/useTaskDashboard";
import { useFilterStore, useViewStore } from "@/store";

export default function MyAssignedTasksPage() {
	const { currentSprint, loading: sprintLoading } = useSprints();
	const { filterTasks } = useFilterStore((state) => state);
	const { view, getGridOptions } = useViewStore((state) => state);

	const {
		loading,
		authorized,
		currentWorkspace,
		teamIdentifier,
		handleDragEnd,
	} = useTaskDashboard();

	const { getGroupedColumns, getHiddenColumns, getTasksForGroup } = useGroups(
		(tasks) =>
			filterTasks(tasks.filter((t) => t.sprintId === currentSprint?.id)),
	);

	// console.log(
	// 	"currentWorkspace",
	// 	currentWorkspace,
	// 	"currentSprint",
	// 	currentSprint,
	// );
	if (!currentWorkspace || !currentSprint) return null;

	return (
		<TaskPageLayout
			loading={loading || sprintLoading}
			authorized={authorized}
			currentWorkspace={currentWorkspace}
			teamIdentifier={teamIdentifier}
			handleDragEnd={handleDragEnd}
			pageTitle={`Current Sprint - ${currentSprint.name}`}
		>
			<div className={`flex flex-grow ${view === "grid" && "mr-4"}`}>
				<ViewAllTasks
					getGroupedColumns={getGroupedColumns}
					sprintId={currentSprint.id}
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
			</div>
		</TaskPageLayout>
	);
}
