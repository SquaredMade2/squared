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
		getFilteredStatuses,
		getTasksForStatus,
	} = useTaskDashboard((tasks) =>
		filterTasks(tasks.filter((t) => t.sprintId === currentSprint?.id)),
	);

	const allowedColumns: Status[] = [
		Status.todo,
		Status.inProgress,
		Status.inReview,
		Status.done,
	];

	const getHiddenColumns = (): Status[] => {
		const filteredStatuses = getFilteredStatuses();

		return filteredStatuses.filter((status) => {
			if (!allowedColumns.includes(status)) return false;

			const tasks = getTasksForStatus(status);
			return tasks && tasks.length === 0;
		});
	};

	if (!currentWorkspace) return null;

	return (
		<TaskPageLayout
			loading={loading || sprintLoading}
			authorized={authorized}
			currentWorkspace={currentWorkspace}
			teamIdentifier={teamIdentifier}
			handleDragEnd={handleDragEnd}
			pageTitle={`Current Sprint - ${currentSprint?.name}`}
		>
			<div className={`flex flex-grow ${view === "grid" && "mr-4"}`}>
				<ViewAllTasks
					getFilteredStatuses={getFilteredStatuses}
					getTasksForStatus={getTasksForStatus}
					allowedColumns={allowedColumns}
				/>
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
			</div>
		</TaskPageLayout>
	);
}
