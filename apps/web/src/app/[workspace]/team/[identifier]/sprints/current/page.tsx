"use client";

import ViewAllTasks from "@/components/ViewAllTasks";
import { TaskPageLayout } from "@/components/ViewAllTasks/PageLayout";
import { useTaskPage } from "@/hooks/useTaskPage";
import { useFilterStore, useTeamStore, useViewStore } from "@/store";
import HiddenColumns from "@/components/ViewAllTasks/HiddenColumns";
import { Status } from "@repo/db";

export default function MyAssignedTasksPage() {
	const { currentSprint } = useTeamStore((state) => state);
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
	} = useTaskPage((tasks) =>
		filterTasks(tasks.filter((t) => t.sprintId === currentSprint?.id)),
	);

	const getHiddenColumns = (): Status[] => {
		const filteredStatuses = getFilteredStatuses();

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
			pageTitle={`Current Sprint - ${currentSprint?.name}`}
		>
			<div className={`flex flex-grow ${view === "grid" && "mr-4"}`}>
				<ViewAllTasks
					getFilteredStatuses={getFilteredStatuses}
					getTasksForStatus={getTasksForStatus}
					allowedColumns={[
						Status.todo,
						Status.inProgress,
						Status.inReview,
						Status.done,
					]}
				/>
				{view === "grid" &&
					!gridViewOptions.showEmptyGroups &&
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
