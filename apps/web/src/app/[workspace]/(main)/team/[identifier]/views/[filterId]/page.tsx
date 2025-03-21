"use client";

import SquaredLoader from "@/components/Loaders/SquaredLoader";
import ViewAllTasks from "@/components/ViewAllTasks";
import HiddenColumns from "@/components/ViewAllTasks/HiddenColumns";
import { TaskPageLayout } from "@/components/ViewAllTasks/PageLayout";
import ViewsDetailSidebar from "@/components/ViewsDetailSidebar";
import { useGroups } from "@/hooks/useGroups";
import { useTaskDashboard } from "@/hooks/useTaskDashboard";
import { useTeams } from "@/hooks/useTeams";
import { client } from "@/lib/client";
import { useFilterStore, useViewStore } from "@/store";
import { parseParams } from "@/utils/parseParams";
import type { Task } from "@squared/db";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export default function FilterViewPage() {
	const params = useParams();
	const { team, loading: teamLoading } = useTeams();
	const { customFilter, filterTasks, setSavedFilters } = useFilterStore(
		(state) => state,
	);
	const { view, getGridOptions } = useViewStore((state) => state);

	const { data: filter, isPending } = useQuery({
		queryKey: ["filter", { teamId: team?.id }],
		queryFn: async () => {
			if (!team) throw new Error("No team found");
			const filters = await client.filter.getFilters
				.$get({
					teamId: team.id,
				})
				.then((res) => res.json());
			setSavedFilters(filters);
			const filterId = parseParams(params.filterId);
			const filterSlug = filterId?.split("-").pop();
			const foundFilter = filters.find((f) =>
				f.id.startsWith(filterSlug || ""),
			);
			return foundFilter;
		},
		enabled: !!team,
	});

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

	if (loading || teamLoading || isPending) {
		return (
			<div className="flex w-full items-center justify-center">
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
			<div className={`flex grow ${view === "grid" && "mr-4"}`}>
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
