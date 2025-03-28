import { client } from "@/lib/client";
import { useTaskStore, useWorkspaceStore } from "@/store";
import type { Label, Priority, Status } from "@squaredmade/db";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type CreateTaskInput = {
	title: string;
	description?: string;
	status?: Status;
	priority?: Priority;
	labels?: Label[];
	dueDate?: Date | null;
	effortEstimate?: number | null;
	teamId: string;
	workspaceId: string;
	sprintId?: string | null;
};

export const useCreateTask = () => {
	const { createTask: addTask } = useTaskStore((state) => state);
	const { workspace, setWorkspace } = useWorkspaceStore((state) => state);
	const queryClient = useQueryClient();

	const createTaskMutation = useMutation({
		mutationFn: async (input: CreateTaskInput) => {
			const res = await client.task.createTask.$post({
				title: input.title,
				description: input.description,
				status: input.status,
				priority: input.priority,
				labels: input.labels,
				dueDate: input.dueDate,
				effortEstimate: input.effortEstimate,
				teamId: input.teamId,
				workspaceId: input.workspaceId,
				sprintId: input.sprintId,
			});
			return await res.json();
		},
		onSuccess: (newTask) => {
			addTask(newTask);
			if (workspace) {
				setWorkspace({
					...workspace,
					tasksCreated: workspace.tasksCreated + 1,
				});
			}
			queryClient.invalidateQueries({ queryKey: ["task"] });
		},
	});

	return {
		createTask: createTaskMutation.mutate,
		isLoading: createTaskMutation.isPending,
		error: createTaskMutation.error,
	};
};
