import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
	useTaskStore,
	useTeamStore,
	useUserStore,
	useWorkspaceStore,
} from "@/store";
import type { Task, Workspace } from "@repo/db";
import { parseParams } from "@/utils/parseParams";

export function useTaskPageData() {
	const { workspace: workspaceUrl, taskIdentifier } = useParams();
	const [workspace, setWorkspace] = useState<Workspace | null>(null);
	const [task, setTask] = useState<Task | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const { getTaskByIdentifier } = useTaskStore((state) => state);
	const { getWorkspace, setCurrentWorkspace } = useWorkspaceStore(
		(state) => state,
	);
	const { getAllUsers } = useUserStore((state) => state);
	const { getAllTeams, setCurrentTeam } = useTeamStore((state) => state);

	useEffect(() => {
		async function fetchData() {
			try {
				setIsLoading(true);

				// Fetch workspace data
				const { workspace, message } = await getWorkspace(
					parseParams(workspaceUrl),
				);
				if (!workspace) {
					throw new Error(message || "Workspace not found");
				}
				setWorkspace(workspace);
				setCurrentWorkspace(workspace);
				await getAllUsers(workspace.id);
				const teams = await getAllTeams(workspace.id);

				// Fetch task data
				const { task, message: taskMessage } = await getTaskByIdentifier(
					workspace.id,
					parseParams(taskIdentifier),
				);
				if (!task) {
					throw new Error(taskMessage || "Task not found");
				}
				const foundTeam = teams.find(
					(t) => t.identifier === parseParams(taskIdentifier).split("-")[0],
				);
				foundTeam && setCurrentTeam(foundTeam);
				setTask(task);

				setIsLoading(false);
			} catch (err) {
				setError(err instanceof Error ? err.message : "An error occurred");
				setIsLoading(false);
			}
		}

		fetchData();
	}, [workspaceUrl, taskIdentifier, getTaskByIdentifier]);

	return { workspace, task, isLoading, error };
}
