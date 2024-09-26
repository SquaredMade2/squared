// created/page.tsx
"use client";

import ViewAllTasks from "@/components/ViewAllTasks";
import { TaskPageLayout } from "@/components/ViewAllTasks/PageLayout";
import { useTaskPage } from "@/hooks/useTaskPage";
import { useAuthStore, useTaskStore } from "@/store";
import type { Task } from "@repo/db";

export default function MyCreatedTasksPage() {
	useTaskStore((state) => state);
	const { user } = useAuthStore((state) => state);

	const filterTasks = (tasks: Task[]) => {
		return tasks.filter((t) => t.authorId === user?.id);
	};
	const {
		loading,
		authorized,
		currentWorkspace,
		teamIdentifier,
		handleDragEnd,
		getFilteredStatuses,
		getTasksForStatus,
	} = useTaskPage(filterTasks);

	if (!currentWorkspace) return null;

	return (
		<TaskPageLayout
			loading={loading}
			authorized={authorized}
			currentWorkspace={currentWorkspace}
			teamIdentifier={teamIdentifier}
			handleDragEnd={handleDragEnd}
		>
			<ViewAllTasks
				getFilteredStatuses={getFilteredStatuses}
				getTasksForStatus={getTasksForStatus}
			/>
		</TaskPageLayout>
	);
}
