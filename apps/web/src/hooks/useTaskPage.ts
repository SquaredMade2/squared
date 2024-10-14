import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useTaskStore, useUserStore } from "@/store";
import { parseParams } from "@/utils/parseParams";
import { useWorkspaces } from "./useWorkspaces";

export function useTaskPage() {
	const { taskIdentifier } = useParams();
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { currentWorkspace, loading: workspaceLoading } = useWorkspaces();
	const { getTaskByIdentifier, tasks } = useTaskStore((state) => state);
	const { getAllUsers } = useUserStore((state) => state);

	const task = tasks.find((t) => t.identifier === taskIdentifier) || null;

	useEffect(() => {
		async function fetchData() {
			if (workspaceLoading) return;

			try {
				if (!currentWorkspace) {
					throw new Error("Workspace not found");
				}
				await getAllUsers(currentWorkspace.id);

				// Fetch task data
				await getTaskByIdentifier(
					currentWorkspace.id,
					parseParams(taskIdentifier),
				);

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
