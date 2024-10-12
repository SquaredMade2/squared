import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useTaskStore, useUserStore } from "@/store";
import type { Task } from "@repo/db";
import { parseParams } from "@/utils/parseParams";
import { useWorkspaces } from "./useWorkspaces";

export function useTaskPage() {
	const [task, setTask] = useState<Task | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const { taskIdentifier } = useParams();
	const { currentWorkspace, loading: workspaceLoading } = useWorkspaces();
	const { getTaskByIdentifier } = useTaskStore((state) => state);
	const { getAllUsers } = useUserStore((state) => state);

	useEffect(() => {
		async function fetchData() {
			if (workspaceLoading) return;

			try {
				if (!currentWorkspace) {
					throw new Error("Workspace not found");
				}
				setIsLoading(true);
				await getAllUsers(currentWorkspace.id);

				// Fetch task data
				const { task, message: taskMessage } = await getTaskByIdentifier(
					currentWorkspace.id,
					parseParams(taskIdentifier),
				);
				if (!task) {
					throw new Error(taskMessage || "Task not found");
				}
				setTask(task);

				setIsLoading(false);
			} catch (err) {
				setError(err instanceof Error ? err.message : "An error occurred");
				setIsLoading(false);
			}
		}

		fetchData();
	}, [
		currentWorkspace,
		taskIdentifier,
		getTaskByIdentifier,
		workspaceLoading,
		getAllUsers,
	]);

	return { currentWorkspace, task, isLoading, error };
}
