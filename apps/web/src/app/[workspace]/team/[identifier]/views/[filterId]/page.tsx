"use client";

import { useParams } from "next/navigation";
import { useFilterStore, useViewStore } from "@/store";
import { useEffect, useState } from "react";
import type { SavedFilter } from "@/store/filters";
import { Status, type Task } from "@repo/db";
import { useTaskPage } from "@/hooks/useTaskPage";
import { TaskPageLayout } from "@/components/ViewAllTasks/PageLayout";
import ViewAllTasks from "@/components/ViewAllTasks";
import HiddenColumns from "@/components/ViewAllTasks/HiddenColumns";
import ViewsDetailSidebar from "@/components/ViewsDetailSidebar";

export default function FilterViewPage() {
	const params = useParams();
	const { savedFilters, customFilter } = useFilterStore((state) => state);
	const { view, getGridOptions } = useViewStore((state) => state);

	const [filter, setFilter] = useState<SavedFilter | null>(null);

	useEffect(() => {
		const filterId =
			typeof params.filterId === "string"
				? params.filterId
				: params.filterId[0];
		const filterSlug = filterId.split("-")[1];
		const foundFilter = savedFilters.find((f) =>
			f.id.startsWith(filterSlug || ""),
		);
		if (foundFilter) {
			setFilter(foundFilter);
		}
	}, [params.filterId, savedFilters]);

	const filterTasksWithFilter = (tasks: Task[]) => {
		if (!filter) {
			return tasks;
		}

		return customFilter(tasks, filter.filter);
	};

	const {
		loading,
		authorized,
		currentWorkspace,
		teamIdentifier,
		handleDragEnd,
		getFilteredStatuses,
		getTasksForStatus,
	} = useTaskPage(filterTasksWithFilter);

	if (!filter) {
		return <div>Loading...</div>;
	}

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
			pageTitle={filter.name}
		>
			<div className={`flex flex-grow ${view === "grid" && "mr-4"}`}>
				<ViewAllTasks
					getFilteredStatuses={getFilteredStatuses}
					getTasksForStatus={getTasksForStatus}
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
			<ViewsDetailSidebar
				filter={filter}
				filterTasksWithFilter={filterTasksWithFilter}
			/>
		</TaskPageLayout>
	);
}
