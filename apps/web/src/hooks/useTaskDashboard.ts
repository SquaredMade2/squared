import { client } from "@/lib/client";
import { useTaskStore, useViewStore } from "@/store";
import { parseError } from "@/utils/parseError";
import { parseParams } from "@/utils/parseParams";
import type { OnDragEndResponder } from "@hello-pangea/dnd";
import type { Status, Task } from "@squaredmade/db";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
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

	const params = useParams();
	const teamIdentifier = parseParams(params.identifier) ?? "";

	const queryClient = useQueryClient();

	const {
		data: fetchedTasks,
		isLoading,
		error: tasksError,
	} = useQuery<Task[], Error>({
		queryKey: ["task", "getAllTasks", team?.id],
		queryFn: async () => {
			if (!team) throw new Error("Team not found");
			const res = await client.task.getAllTasks.$get({
				teamId: team.id,
			});
			const teamTasks = await res.json();
			setTasks(teamTasks);
			return teamTasks;
		},
		enabled: !!team && !teamLoading && !workspaceLoading,
	});

	const allBlockedTaskIdsQuery = useQuery({
		queryKey: ["task", "allBlockedTasksIds", team?.id],
		queryFn: async () => {
			if (!team) throw new Error("Team not found");
			const res = await client.task.getAllBlockedTaskIds.$get({
				teamId: team.id,
			});
			const allIds = await res.json();
			setAllBlockedTaskIds(allIds);
			return allIds;
		},
		enabled: !!team?.id,
	});

	const updateTaskMutation = useMutation({
		mutationFn: async ({
			taskId,
			status,
		}: { taskId: string; status: Status }) => {
			const res = await client.task.updateStatus.$post({
				taskId,
				status,
			});
			const updatedTask = await res.json();
			updateTask(updatedTask);
			return updatedTask;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["task", team?.id] });
		},
	});

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
			const items = tasks.filter(
				(task) => task.parentId === draggedTask.parentId,
			);
			const [reorderedItem] = items.splice(source.index, 1);
			items.splice(destination.index, 0, reorderedItem);
			const teamTasks = await client.task.updateSubtaskOrder
				.$post({
					parentId: draggedTask.parentId,
					newOrder: items.map((item) => item.id),
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

		// Update the task status
		updateTaskMutation.mutate({
			taskId: draggedTask.id,
			status: targetStatus,
		});

		await queryClient.invalidateQueries({
			queryKey: ["task", team?.id],
		});
	};

	const loading =
		teamLoading ||
		workspaceLoading ||
		allBlockedTaskIdsQuery.isLoading ||
		isLoading;
	const error =
		teamError ||
		workspaceError ||
		allBlockedTaskIdsQuery.error ||
		parseError(tasksError);

	return {
		loading,
		authorized,
		workspace,
		teamIdentifier,
		handleDragEnd,
		tasks: fetchedTasks || tasks,
		error: error || null,
	};
}
