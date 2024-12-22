import { client } from "@/lib/client";
import { useTaskStore, useUserStore } from "@/store";
import { parseError } from "@/utils/parseError";
import { parseParams } from "@/utils/parseParams";
import type { OnDragEndResponder } from "@hello-pangea/dnd";
import type { Status, Task } from "@squared/db";
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
	const { tasks, setTasks, updateTask } = useTaskStore((state) => state);
	const user = useUserStore((state) => state.user);

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

	const updateTaskMutation = useMutation({
		mutationFn: async ({
			taskId,
			status,
		}: { taskId: string; status: Status }) => {
			if (!user) throw new Error("User not found");
			const res = await client.task.updateStatus.$post({
				taskId,
				status,
				updaterId: user.id,
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
		if (!destination || destination.droppableId === source.droppableId) return;

		const draggedTask = tasks.find((task) => task.id === draggableId);
		if (!draggedTask) return;

		updateTaskMutation.mutate({
			taskId: draggedTask.id,
			status: destination.droppableId as Status,
		});
	};

	const loading = teamLoading || workspaceLoading || isLoading;
	const error = teamError || workspaceError || parseError(tasksError);

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
