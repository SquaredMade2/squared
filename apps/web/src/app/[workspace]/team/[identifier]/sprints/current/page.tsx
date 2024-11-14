"use client";

import SquaredLoader from "@/components/Loaders/SquaredLoader";
import ViewAllTasks from "@/components/ViewAllTasks";
import HiddenColumns from "@/components/ViewAllTasks/HiddenColumns";
import { TaskPageLayout } from "@/components/ViewAllTasks/PageLayout";
import { useGroups } from "@/hooks/useGroups";
import { useSprints } from "@/hooks/useSprints";
import { useTaskDashboard } from "@/hooks/useTaskDashboard";
import { useFilterStore, useViewStore } from "@/store";

export default function MyAssignedTasksPage() {
	const { sprint, loading: sprintLoading } = useSprints();
	const { filterTasks } = useFilterStore((state) => state);
	const { view, getGridOptions } = useViewStore((state) => state);

	const { loading, authorized, workspace, teamIdentifier, handleDragEnd } =
		useTaskDashboard();

	const { getGroupedColumns, getHiddenColumns, getTasksForGroup } = useGroups(
		(tasks) => filterTasks(tasks.filter((t) => t.sprintId === sprint?.id)),
	);

	if (sprintLoading) {
		return (
			<div className="h-screen w-full">
				<div className="flex h-full justify-center items-center">
					<div className="flex flex-col gap-4 items-center">
						<div className="font-bold text-3xl">Loading</div>
						<SquaredLoader />
					</div>
				</div>
			</div>
		);
	}

	if (!workspace || !sprint) return null;
	return (
		<TaskPageLayout
			loading={loading || sprintLoading}
			authorized={authorized}
			currentWorkspace={workspace}
			teamIdentifier={teamIdentifier}
			handleDragEnd={handleDragEnd}
			pageTitle={`Current Sprint - ${sprint.name}`}
		>
			<div className={`flex flex-grow ${view === "grid" && "mr-4"}`}>
				<ViewAllTasks
					getGroupedColumns={getGroupedColumns}
					sprintId={sprint.id}
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
