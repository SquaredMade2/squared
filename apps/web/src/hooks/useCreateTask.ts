import { useError } from "@/context/ErrorContext";
import { useLoading } from "@/context/LoadingContext";
import { client } from "@/lib/client";
import { useTaskStore, useWorkspaceStore } from "@/store";
import type { Label, Priority, Status } from "@squaredmade/db";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

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

	// Use the global loading and error contexts
	const { startLoading, stopLoading } = useLoading();
	const { setError, clearError } = useError();

	const createTaskMutation = useMutation({
		mutationFn: async (input: CreateTaskInput) => {
			const loadingKey = `createTask-${input.teamId}`;
			startLoading(loadingKey);
			clearError(loadingKey);

			try {
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
			} catch (error) {
				setError(loadingKey, error as Error);
				throw error;
			} finally {
				stopLoading(loadingKey);
			}
		},
		onSuccess: (newTask) => {
			// Add the new task to the store
			addTask(newTask);

			// Update workspace tasks count
			if (workspace) {
				setWorkspace({
					...workspace,
					tasksCreated: workspace.tasksCreated + 1,
				});
			}

			// Invalidate queries that depend on task data
			queryClient.invalidateQueries({
				queryKey: ["task"],
				// Make this exact to avoid over-invalidation
				exact: false,
			});
		},
	});

	// Memoize the createTask callback
	const createTask = useCallback(
		(input: CreateTaskInput) => {
			return createTaskMutation.mutate(input);
		},
		[createTaskMutation],
	);

	// Memoize the return values
	return useMemo(
		() => ({
			createTask,
			isLoading: createTaskMutation.isPending,
			error: createTaskMutation.error,
		}),
		[createTask, createTaskMutation.isPending, createTaskMutation.error],
	);
};
