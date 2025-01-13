import { client } from "@/lib/client";
import { useTaskStore, useUserStore, useWorkspaceStore } from "@/store";
import type { Priority, Status } from "@squared/db";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type CreateTaskInput = {
	title: string;
	description?: string;
	status?: Status;
	priority?: Priority;
	labels?: string[];
	dueDate?: Date | null;
	effortEstimate?: number | null;
	teamId: string;
	workspaceId: string;
};

export const useCreateTask = () => {
	const user = useUserStore((state) => state.user);
	const { createTask: addTask } = useTaskStore((state) => state);
	const { workspace, setWorkspace } = useWorkspaceStore((state) => state);
	const queryClient = useQueryClient();

	const createTaskMutation = useMutation({
		mutationFn: async (input: CreateTaskInput) => {
			if (!user) throw new Error("User not found");
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
			queryClient.invalidateQueries({ queryKey: ["tasks"] });
		},
	});

	return {
		createTask: createTaskMutation.mutate,
		isLoading: createTaskMutation.isPending,
		error: createTaskMutation.error,
	};
};
