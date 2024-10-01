"use client";

import ViewAllTasks from "@/components/ViewAllTasks";
import { TaskPageLayout } from "@/components/ViewAllTasks/PageLayout";
import { useTaskPage } from "@/hooks/useTaskPage";
import { useFilterStore } from "@/store";

const Page = () => {
	const { filterTasks } = useFilterStore((state) => state);

	const {
		loading,
		authorized,
		currentWorkspace,
		teamIdentifier,
		handleDragEnd,
		getFilteredStatuses,
		getTasksForStatus,
	} = useTaskPage((tasks) =>
		filterTasks(tasks.filter((t) => t.deleted === true)),
	);

	if (!currentWorkspace) return null;

	return (
		<TaskPageLayout
			loading={loading}
			authorized={authorized}
			currentWorkspace={currentWorkspace}
			teamIdentifier={teamIdentifier}
			handleDragEnd={handleDragEnd}
			pageTitle="Recently Deleted Tasks"
		>
			<ViewAllTasks
				getFilteredStatuses={getFilteredStatuses}
				getTasksForStatus={getTasksForStatus}
			/>
		</TaskPageLayout>
	);
};

export default Page;
