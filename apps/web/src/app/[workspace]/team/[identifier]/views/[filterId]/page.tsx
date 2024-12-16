"use client";

import SquaredLoader from "@/components/Loaders/SquaredLoader";
import ViewAllTasks from "@/components/ViewAllTasks";
import HiddenColumns from "@/components/ViewAllTasks/HiddenColumns";
import { TaskPageLayout } from "@/components/ViewAllTasks/PageLayout";
import ViewsDetailSidebar from "@/components/ViewsDetailSidebar";
import { useGroups } from "@/hooks/useGroups";
import { useTaskDashboard } from "@/hooks/useTaskDashboard";
import { useSprintStore } from "@/store";
import { useTeams } from "@/hooks/useTeams";
import { filterService } from "@/lib/services";
import { useFilterStore, useViewStore } from "@/store";
import type { SavedFilter } from "@/store/filters";
import { parseParams } from "@/utils/parseParams";
import { TODO } from "@squared/context";
import type { Task } from "@squared/db";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function FilterViewPage() {
	const params = useParams();
	const { team, loading: teamLoading } = useTeams();
	const { customFilter, filterTasks, setSavedFilters } = useFilterStore(
		(state) => state,
	);

	const { view, getGridOptions } = useViewStore((state) => state);

	const [filter, setFilter] = useState<SavedFilter | null>(null);
	// todo get sprintId from filter
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const getData = async () => {
			if (teamLoading) return;
			if (team) {
				setIsLoading(true);
				const filters = await filterService.getFilters(TODO, {
					teamId: team.id,
				});
				setSavedFilters(filters);
				const filterId = parseParams(params.filterId);
				const filterSlug = filterId.split("-").pop();
				const foundFilter = filters.find((f) =>
					f.id.startsWith(filterSlug || ""),
				);
				if (foundFilter) {
					setFilter(foundFilter);
				}
				setIsLoading(false);
			}
		};
		getData();
	}, [params.filterId, team, teamLoading]);

	const filterTasksWithFilter = (tasks: Task[]) => {
		if (!filter) {
			return tasks;
		}

		return filterTasks(customFilter(tasks, filter.filter));
	};

	const { loading, authorized, workspace, teamIdentifier, handleDragEnd } =
		useTaskDashboard();

	const { getGroupedColumns, getTasksForGroup, getHiddenColumns } = useGroups(
		filterTasksWithFilter,
	);

	if (loading || teamLoading || isLoading) {
		return (
			<div className="w-full flex justify-center items-center">
				<SquaredLoader />
			</div>
		);
	}

	if (!workspace) return null;
	if (!filter) return null;

	return (
		<TaskPageLayout
			loading={loading}
			authorized={authorized}
			currentWorkspace={workspace}
			teamIdentifier={teamIdentifier}
			handleDragEnd={handleDragEnd}
			pageTitle={filter.name}
		>
			<div className={`flex flex-grow ${view === "grid" && "mr-4"}`}>
			{/* todo add ViewAllTasks here */}
				<ViewAllTasks getGroupedColumns={getGroupedColumns} />
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
			<ViewsDetailSidebar
				filter={filter}
				filterTasksWithFilter={filterTasksWithFilter}
			/>
		</TaskPageLayout>
	);
}
