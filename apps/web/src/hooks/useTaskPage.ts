import { taskService } from "@/lib/services";
import { useTaskStore, useTeamStore } from "@/store";
import { parseParams } from "@/utils/parseParams";
import { TODO } from "@squared/context";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useUsers } from "./useUsers";
import { useWorkspaces } from "./useWorkspaces";

export function useTaskPage() {
	const { taskIdentifier } = useParams();
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { currentWorkspace, loading: workspaceLoading } = useWorkspaces();
	const { teams, setCurrentTeam } = useTeamStore((state) => state);
	const { tasks, setCurrentTask } = useTaskStore((state) => state);
	useUsers();
	const [task, setTask] = useState(
		tasks.find((t) => t.identifier === taskIdentifier) || null,
	);

	useEffect(() => {
		async function fetchData() {
			if (workspaceLoading) return;

			try {
				if (!currentWorkspace) {
					throw new Error("Workspace not found");
				}

				// Fetch team data
				const teamIdentifier = parseParams(taskIdentifier).split("-")[0];
				const team = teams.find((t) => t.identifier === teamIdentifier);
				if (team) {
					setCurrentTeam(team);
				}

				// Fetch task data
				const pageTask = await taskService.getTaskByIdentifier(TODO, {
					workspaceId: currentWorkspace.id,
					identifier: parseParams(taskIdentifier),
				});
				if (pageTask) {
					setTask(pageTask);
					setCurrentTask(pageTask);
				}

				setIsLoading(false);
			} catch (err) {
				setError(err instanceof Error ? err.message : "An error occurred");
				setIsLoading(false);
			}
		}

		fetchData();
	}, [currentWorkspace, taskIdentifier, workspaceLoading, teams]);

	return { currentWorkspace, task, isLoading, error };
}
