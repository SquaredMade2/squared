import { client } from "@/lib/client";
import { useTaskStore } from "@/store";
import { taskService } from "@/lib/services";
import { parseError } from "@/utils/parseError";
import { parseParams } from "@/utils/parseParams";
import type { OnDragEndResponder } from "@hello-pangea/dnd";
import type { Status, Task } from "@squared/db";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useTeams } from "./useTeams";
import { useWorkspaces } from "./useWorkspaces";
import { TODO } from "@squared/context";

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
	const { tasks, setTasks, updateTask, setAllBlockedTaskIds, setSubtasks } = useTaskStore(
		(state) => state,
	);

	const params = useParams();
	const teamIdentifier = parseParams(params.identifier);
	const queryClient = useQueryClient();

	const {
		data: fetchedTasks,
		isLoading,
		error: tasksError,
	} = useQuery<Task[], Error>({
		queryKey: ["tasks", team?.id],
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
		queryKey: ["allBlockedTasksIds", team?.id],
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
			await queryClient.invalidateQueries({ queryKey: ["tasks", team?.id] });
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
		if (destination.droppableId === source.droppableId && draggedTask.parentId) {
			const items = tasks.filter((task) => task.parentId === draggedTask.parentId)
			const [reorderedItem] = items.splice(source.index, 1);
			items.splice(destination.index, 0, reorderedItem);
			await taskService.reorderSubtasks(TODO, {
				parentId: draggedTask.parentId ?? "",
				newOrder: items.map((item) => item.id),
			});
			return;
		}
		updateTaskMutation.mutate({
			taskId: draggedTask.id,
			status: destination.droppableId as Status,
		});
		await queryClient.invalidateQueries({
			queryKey: ["allBlockedTasksIds", team?.id],
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
