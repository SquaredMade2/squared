"use client";

import { useParams } from "next/navigation";
import { useFilterStore, useViewStore } from "@/store";
import { useEffect, useState } from "react";
import type { SavedFilter } from "@/store/filters";
import type { Task } from "@repo/db";
import { useTaskDashboard } from "@/hooks/useTaskDashboard";
import { TaskPageLayout } from "@/components/ViewAllTasks/PageLayout";
import ViewAllTasks from "@/components/ViewAllTasks";
import HiddenColumns from "@/components/ViewAllTasks/HiddenColumns";
import ViewsDetailSidebar from "@/components/ViewsDetailSidebar";
import { parseParams } from "@/utils/parseParams";
import { useTeams } from "@/hooks/useTeams";

export default function FilterViewPage() {
	const params = useParams();
	const { currentTeam, loading: teamLoading } = useTeams();
	const { customFilter, filterTasks, getSavedFilters } = useFilterStore(
		(state) => state,
	);
	const { view, getGridOptions } = useViewStore((state) => state);

	const [filter, setFilter] = useState<SavedFilter | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const getData = async () => {
			if (teamLoading) return;
			if (currentTeam) {
				setIsLoading(true);
				const filters = await getSavedFilters(currentTeam?.id);
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
	}, [params.filterId, currentTeam, teamLoading]);

	const filterTasksWithFilter = (tasks: Task[]) => {
		if (!filter) {
			return tasks;
		}

		return filterTasks(customFilter(tasks, filter.filter));
	};

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
	} = useTaskDashboard(filterTasksWithFilter);

	if (!loading || teamLoading || isLoading) {
		return <div>Loading...</div>;
	}

	if (!currentWorkspace) return null;
	if (!filter) return null;

	return (
		<TaskPageLayout
			loading={loading}
			authorized={authorized}
			currentWorkspace={currentWorkspace}
			teamIdentifier={teamIdentifier}
			handleDragEnd={handleDragEnd}
			pageTitle={filter.name}
		>
			<div className={`flex flex-grow ${view === "grid" && "mr-4"}`}>
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
								formatColumnTitle={formatColumnTitle}
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
