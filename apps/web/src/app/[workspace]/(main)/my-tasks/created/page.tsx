"use client";

import ViewAllTasks from "@/components/ViewAllTasks";
import { TaskPageLayout } from "@/components/ViewAllTasks/PageLayout";
import { useGroups } from "@/hooks/useGroups";
import { useTaskDashboard } from "@/hooks/useTaskDashboard";
import { useFilterStore } from "@/store";
import { useUser } from "@clerk/nextjs";

export default function MyCreatedTasksPage() {
	const { user } = useUser();
	const { filterTasks } = useFilterStore((state) => state);

	const { loading, authorized, workspace, teamIdentifier, handleDragEnd } =
		useTaskDashboard();

	const { getGroupedColumns } = useGroups((tasks) =>
		filterTasks(tasks.filter((t) => t.authorId === user?.id)),
	);

	if (!workspace) return null;

	return (
		<TaskPageLayout
			loading={loading}
			authorized={authorized}
			currentWorkspace={workspace}
			teamIdentifier={teamIdentifier}
			handleDragEndAction={handleDragEnd}
			pageTitle="Created Tasks"
		>
			<ViewAllTasks getGroupedColumns={getGroupedColumns} />
		</TaskPageLayout>
	);
}
