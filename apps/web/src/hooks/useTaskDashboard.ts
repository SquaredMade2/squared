import { useError } from "@/context/ErrorContext";
import { useLoading } from "@/context/LoadingContext";
import { client } from "@/lib/client";
import { useTaskStore, useViewStore } from "@/store";
import { parseError } from "@/utils/parseError";
import { parseParams } from "@/utils/parseParams";
import type { OnDragEndResponder } from "@hello-pangea/dnd";
import type { Status, Task } from "@squaredmade/db";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useTeams } from "./useTeams";
import { useWorkspaces } from "./useWorkspaces";

export function useTaskDashboard() {
	const {
		loading: teamLoading,
		team,
		authorized,
		error: teamError,
	} = useTeams();

	const {
		loading: workspaceLoading,
		workspace,
		error: workspaceError,
	} = useWorkspaces();

	const { tasks, setTasks, updateTask, setAllBlockedTaskIds } = useTaskStore(
		(state) => state,
	);

	const { displayOptions } = useViewStore((state) => state);
	const { groupRowsBy } = displayOptions;

	// Use the global loading and error contexts if available
	const { startLoading, stopLoading } = useLoading();
	const { setError, clearError } = useError();

	const params = useParams();
	// Memoize parsed identifier to prevent unnecessary parsing
	const teamIdentifier = useMemo(
		() => parseParams(params.identifier) ?? "",
		[params.identifier],
	);

	const queryClient = useQueryClient();

	// Optimize queries with staleTime and caching strategies
	const {
		data: fetchedTasks,
		isLoading,
		error: tasksError,
	} = useQuery<Task[], Error>({
		queryKey: ["task", "getAllTasks", team?.id],
		queryFn: async () => {
			if (!team) throw new Error("Team not found");

			const loadingKey = `tasks-${team.id}`;
			startLoading(loadingKey);
			clearError(loadingKey);

			try {
				const res = await client.task.getAllTasks.$get({
					teamId: team.id,
				});
				const teamTasks = await res.json();

				// Only update state if the data has changed
				const tasksChanged =
					JSON.stringify(tasks) !== JSON.stringify(teamTasks);
				if (tasksChanged) {
					setTasks(teamTasks);
				}

				return teamTasks;
			} catch (error) {
				setError(loadingKey, error as Error);
				throw error;
			} finally {
				stopLoading(loadingKey);
			}
		},
		// Add staleTime to prevent frequent refetches
		staleTime: 5 * 60 * 1000, // 5 minutes
		enabled: !!team && !teamLoading && !workspaceLoading,
	});

	const allBlockedTaskIdsQuery = useQuery({
		queryKey: ["task", "allBlockedTasksIds", team?.id],
		queryFn: async () => {
			if (!team) throw new Error("Team not found");

			const loadingKey = `blockedTasks-${team.id}`;
			startLoading(loadingKey);

			try {
				const res = await client.task.getAllBlockedTaskIds.$get({
					teamId: team.id,
				});
				const allIds = await res.json();
				setAllBlockedTaskIds(allIds);
				return allIds;
			} catch (error) {
				setError(loadingKey, error as Error);
				throw error;
			} finally {
				stopLoading(loadingKey);
			}
		},
		// Add staleTime to prevent frequent refetches
		staleTime: 5 * 60 * 1000, // 5 minutes
		enabled: !!team?.id,
	});

	const updateTaskMutation = useMutation({
		mutationFn: async ({
			taskId,
			status,
		}: { taskId: string; status: Status }) => {
			const loadingKey = `updateTask-${taskId}`;
			startLoading(loadingKey);
			clearError(loadingKey);

			try {
				const res = await client.task.updateStatus.$post({
					taskId,
					status,
				});
				const updatedTask = await res.json();
				updateTask(updatedTask);
				return updatedTask;
			} catch (error) {
				setError(loadingKey, error as Error);
				throw error;
			} finally {
				stopLoading(loadingKey);
			}
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["task", team?.id],
				exact: true, // Only invalidate exact match
			});
		},
	});

	// Memoize the drag end handler
	const handleDragEnd: OnDragEndResponder = useCallback(
		async ({ destination, source, draggableId }) => {
			if (!destination) return;

			const draggedTask = tasks.find((task) => task.id === draggableId);
			if (!draggedTask) return;

			// If the dragged task is in the same droppableId and its a subtask, reorder the subtask
			if (
				destination.droppableId === source.droppableId &&
				draggedTask.parentId &&
				team
			) {
				const items = tasks.filter(
					(task) => task.parentId === draggedTask.parentId,
				);
				const [reorderedItem] = items.splice(source.index, 1);
				items.splice(destination.index, 0, reorderedItem);
				try {
					const teamTasks = await client.task.updateSubtaskOrder
						.$post({
							parentId: draggedTask.parentId,
							newOrder: items.map((item) => item.id),
						})
						.then((res) => res.json());
					setTasks(teamTasks);
				} catch (error) {
					console.error("Failed to update subtask order:", error);
				}
				return;
			}

			// Handle row grouping - extract the status from composite droppableId
			let targetStatus: Status;

			// Check if row grouping is active and we have a composite droppableId
			if (groupRowsBy !== "None" && destination.droppableId.includes("-")) {
				// Extract just the status part (before the first dash)
				const [statusPart] = destination.droppableId.split("-");
				targetStatus = statusPart as Status;
			} else {
				// Normal case - the droppableId is directly the status
				targetStatus = destination.droppableId as Status;
			}

			// Update the task status
			updateTaskMutation.mutate({
				taskId: draggedTask.id,
				status: targetStatus,
			});
		},
		[tasks, team, groupRowsBy, updateTaskMutation, setTasks],
	);

	// Memoize computed values
	const loading = useMemo(
		() =>
			teamLoading ||
			workspaceLoading ||
			allBlockedTaskIdsQuery.isLoading ||
			isLoading,
		[
			teamLoading,
			workspaceLoading,
			allBlockedTaskIdsQuery.isLoading,
			isLoading,
		],
	);

	const error = useMemo(
		() =>
			teamError ||
			workspaceError ||
			allBlockedTaskIdsQuery.error ||
			parseError(tasksError),
		[teamError, workspaceError, allBlockedTaskIdsQuery.error, tasksError],
	);

	// Return memoized result to prevent unnecessary rerenders
	return useMemo(
		() => ({
			loading,
			authorized,
			workspace,
			teamIdentifier,
			handleDragEnd,
			tasks: fetchedTasks || tasks,
			error: error || null,
		}),
		[
			loading,
			authorized,
			workspace,
			teamIdentifier,
			handleDragEnd,
			fetchedTasks,
			tasks,
			error,
		],
	);
}
