import { commentService, eventService, taskService } from "@/lib/services";
import {
	useCommentStore,
	useEventStore,
	useTaskStore,
	useTeamStore,
} from "@/store";
import { parseParams } from "@/utils/parseParams";
import { TODO } from "@squared/context";
import type { TaskEvent } from "@squared/db";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useUsers } from "./useUsers";
import { useWorkspaces } from "./useWorkspaces";

export function useTaskPage() {
	const { taskIdentifier } = useParams();
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { workspace, loading: workspaceLoading } = useWorkspaces();
	const { teams, setTeam } = useTeamStore((state) => state);
	const { tasks, setCurrentTask, subtasks, setSubtasks } = useTaskStore(
		(state) => state,
	);
	const { users, loading: userLoading } = useUsers();
	const { setComments } = useCommentStore((state) => state);
	const { setEvents } = useEventStore((state) => state);
	useUsers();
	const [task, setTask] = useState(
		tasks.find((t) => t.identifier === taskIdentifier) || null,
	);

	useEffect(() => {
		async function fetchData() {
			if (workspaceLoading) return;

			try {
				if (!workspace) {
					throw new Error("Workspace not found");
				}

				// Fetch team data
				const teamIdentifier = parseParams(taskIdentifier).split("-")[0];
				const team = teams.find((t) => t.identifier === teamIdentifier);
				if (team) {
					setTeam(team);
				}

				// Fetch task data
				const pageTask = await taskService.getTaskByIdentifier(TODO, {
					workspaceId: workspace.id,
					identifier: parseParams(taskIdentifier),
				});
				if (pageTask) {
					setTask(pageTask);
					setCurrentTask(pageTask);
					const [subtasks, comments, taskEvents] = await Promise.all([
						taskService.getSubtasks(TODO, { parentId: pageTask?.id }),
						commentService.getTaskComments(TODO, { taskId: pageTask.id }),
						eventService.getTaskEvents(TODO, { taskId: pageTask.id }),
					]);
					setSubtasks(subtasks);
					setComments(comments);
					setEvents(taskEvents as TaskEvent[]);
				}

				setIsLoading(false);
			} catch (err) {
				setError(err instanceof Error ? err.message : "An error occurred");
				setIsLoading(false);
			}
		}

		fetchData();
	}, [workspace, taskIdentifier, workspaceLoading, teams, userLoading]);

	return { workspace, users, task, isLoading, error, subtasks };
}
