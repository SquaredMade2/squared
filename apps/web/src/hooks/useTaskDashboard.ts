import { client } from "@/lib/client";
import { useTaskStore, useViewStore } from "@/store";
import { parseError } from "@/utils/parseError";
import { parseParams } from "@/utils/parseParams";
import type { OnDragEndResponder } from "@hello-pangea/dnd";
import type { Status, Task } from "@squaredmade/db";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useTeams } from "./useTeams";
import { useWorkspaces } from "./useWorkspaces";

export function useTaskDashboard() {
	const params = useParams();
	const teamIdentifier = parseParams(params.identifier) ?? "";

	const queryClient = useQueryClient();
	const { tasks, setTasks, updateTask, setAllBlockedTaskIds } = useTaskStore(
		(state) => state,
	);
	const { displayOptions } = useViewStore((state) => state);
	const { groupRowsBy } = displayOptions;

	// Get team and workspace data
	const {
		team,
		authorized,
		loading: teamLoading,
		error: teamError,
	} = useTeams();

	const {
		workspace,
		loading: workspaceLoading,
		error: workspaceError,
	} = useWorkspaces();

	// Fetch tasks with optimized loading conditions
	const {
		data: fetchedTasks,
		isLoading: tasksLoading,
		error: tasksError,
	} = useQuery<Task[], Error>({
		queryKey: ["task", "getAllTasks", team?.id],
		queryFn: async () => {
			if (!team) throw new Error("Team not found");
			const res = await client.task.getAllTasks.$get({
				teamId: team.id,
			});
			return res.json();
		},
		enabled: !!team?.id,
		staleTime: 1 * 60 * 1000, // Consider data fresh for 1 minute
	});

	// Update task store when fetchedTasks changes
	useEffect(() => {
		if (fetchedTasks) {
			setTasks(fetchedTasks);
		}
	}, [fetchedTasks, setTasks]);

	// Fetch blocked task IDs in parallel
	const { data: blockedTaskIds, isLoading: blockedTasksLoading } = useQuery({
		queryKey: ["task", "allBlockedTasksIds", team?.id],
		queryFn: async () => {
			if (!team) throw new Error("Team not found");
			const res = await client.task.getAllBlockedTaskIds.$get({
				teamId: team.id,
			});
			return res.json();
		},
		enabled: !!team?.id,
		staleTime: 2 * 60 * 1000, // Consider blocked tasks data fresh for 2 minutes
	});

	// Update blocked tasks in store
	useEffect(() => {
		if (blockedTaskIds) {
			setAllBlockedTaskIds(blockedTaskIds);
		}
	}, [blockedTaskIds, setAllBlockedTaskIds]);

	// Task update mutation
	const updateTaskMutation = useMutation({
		mutationFn: async ({
			taskId,
			status,
		}: { taskId: string; status: Status }) => {
			const res = await client.task.updateStatus.$post({
				taskId,
				status,
			});
			return res.json();
		},
		onSuccess: (updatedTask) => {
			// Optimistic update
			updateTask(updatedTask);
			// Then invalidate to ensure consistency
			queryClient.invalidateQueries({ queryKey: ["task", team?.id] });
		},
	});

	// Drag and drop handler with optimizations
	const handleDragEnd: OnDragEndResponder = async ({
		destination,
		source,
		draggableId,
	}) => {
		if (!destination) return;

		const draggedTask = tasks.find((task) => task.id === draggableId);
		if (!draggedTask) return;

		// If the dragged task is in the same droppableId and its a subtask, reorder the subtask
		if (
			destination.droppableId === source.droppableId &&
			draggedTask.parentId &&
			team
		) {
			// Optimistic update for better UX
			const currentTasks = [...tasks];
			const subtasks = currentTasks.filter(
				(task) => task.parentId === draggedTask.parentId,
			);
			const [reorderedItem] = subtasks.splice(source.index, 1);
			subtasks.splice(destination.index, 0, reorderedItem);

			// Create updated tasks array with the reordered subtasks
			const updatedTasks = currentTasks.map((task) =>
				task.parentId === draggedTask.parentId
					? subtasks.find((s) => s.id === task.id) || task
					: task,
			);

			// Update local state immediately for better UX
			setTasks(updatedTasks);

			// Then perform the server update
			const teamTasks = await client.task.updateSubtaskOrder
				.$post({
					parentId: draggedTask.parentId,
					newOrder: subtasks.map((item) => item.id),
				})
				.then((res) => res.json());

			setTasks(teamTasks);
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

		// Optimistic update for immediate UI feedback
		const updatedTasks = tasks.map((task) =>
			task.id === draggedTask.id ? { ...task, status: targetStatus } : task,
		);
		setTasks(updatedTasks);

		// Then perform the actual update
		updateTaskMutation.mutate({
			taskId: draggedTask.id,
			status: targetStatus,
		});
	};

	// Split loading states for more granular UI updates
	const initialDataLoading = teamLoading || workspaceLoading;
	const tasksDataLoading = tasksLoading;
	const backgroundDataLoading = blockedTasksLoading;

	// Combine loading states for main return value, but prioritize tasks
	const loading = initialDataLoading || tasksDataLoading;

	// Combine errors
	const error = teamError || workspaceError || parseError(tasksError);

	return {
		// Primary states
		loading,
		authorized,
		workspace,
		teamIdentifier,
		handleDragEnd,
		tasks: fetchedTasks || tasks,
		error: error || null,

		// Additional loading states for more granular UI control
		initialDataLoading,
		tasksDataLoading,
		backgroundDataLoading,

		// Included for completeness
		blockedTaskIds,
		team,
	};
}
