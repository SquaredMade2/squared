import { taskService } from "@/lib/services";
import {
	useAuthStore,
	useTaskStore,
	useTeamStore,
	useWorkspaceStore,
} from "@/store";
import { transformingMentionInputs } from "@/utils/transformingMentionInputs";
import { TODO } from "@squared/context";
import type { Task } from "@squared/db";
import { useState } from "react";

export const useCreateTask = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { user } = useAuthStore((state) => state);
	const { team } = useTeamStore((state) => state);
	const { createTask: addTask } = useTaskStore((state) => state);
	const { currentWorkspace, setCurrentWorkspace } = useWorkspaceStore(
		(state) => state,
	);

	const createTask = async (input: Partial<Task>) => {
		setIsLoading(true);
		setError(null);

		try {
			if (!currentWorkspace) {
				throw new Error("Error authenticating workspace");
			}
			if (!team) {
				throw new Error("Error authenticating team");
			}
			if (!user) {
				throw new Error("Error authenticating user");
			}

			const { transformedInput: transformedTitle } = transformingMentionInputs(
				input.title ?? "",
			);
			const { transformedInput: transformedDescriptionInput } =
				transformingMentionInputs(input.description ?? "");

			if (!user) throw new Error("No user found");

			const newTask = {
				...input,
				authorId: user.id,
				title: transformedTitle,
				description: transformedDescriptionInput,
				status: input.status ?? "backlog",
				priority: input.priority ?? "noPriority",
				labels: input.labels || [],
				dueDate: input.dueDate ?? null,
				effortEstimate: input.effortEstimate ?? null,
				teamId: team.id,
				workspaceId: currentWorkspace.id,
			};

			const task = await taskService.createTask(TODO, newTask);

			if (!task) {
				throw new Error("Failed to create task");
			}
			addTask(task);

			setCurrentWorkspace({
				...currentWorkspace,
				tasksCreated: currentWorkspace.tasksCreated + 1,
			});

			return task;
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "An unknown error occurred",
			);
			throw err;
		} finally {
			setIsLoading(false);
		}
	};

	return { createTask, isLoading, error };
};
