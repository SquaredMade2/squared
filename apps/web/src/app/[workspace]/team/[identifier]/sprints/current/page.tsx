"use client";

import ViewAllTasks from "@/components/ViewAllTasks";
import { TaskPageLayout } from "@/components/ViewAllTasks/PageLayout";
import { useSprints } from "@/hooks/useSprints";
import { useTaskDashboard } from "@/hooks/useTaskDashboard";
import { useFilterStore, useViewStore } from "@/store";
import HiddenColumns from "@/components/ViewAllTasks/HiddenColumns";
import { Status } from "@repo/db";

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
		getGroupColumnTitles,
		getTasksForGroup,
		getHiddenColumns,
		formatColumnTitle,
	} = useTaskDashboard((tasks) =>
		filterTasks(tasks.filter((t) => t.sprintId === currentSprint?.id)),
	);

	const allowedColumns: Status[] = [
		Status.todo,
		Status.inProgress,
		Status.inReview,
		Status.done,
	];

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
					getGroupColumnTitles={getGroupColumnTitles}
					getTasksForGroup={getTasksForGroup}
					allowedColumns={allowedColumns}
					sprintId={currentSprint.id}
				/>
				{view === "grid" &&
					!getGridOptions().showEmptyGroups &&
					getHiddenColumns().length >= 1 && (
						<div className="ml-auto">
							<HiddenColumns
								getHiddenColumns={getHiddenColumns}
								getTasksForGroup={getTasksForGroup}
								formatColumnTitle={formatColumnTitle}
							/>
						</div>
					)}
			</div>
		</TaskPageLayout>
	);
}
