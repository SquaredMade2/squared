import {
	useAuthStore,
	useTaskStore,
	useTeamStore,
	useWorkspaceStore,
} from "@/store";
import { transformingMentionInputs } from "@/utils/transformingMentionInputs";
import type { Task } from "@squared/db";
import { useState } from "react";

export const useCreateTask = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { user } = useAuthStore((state) => state);
	const { currentTeam } = useTeamStore((state) => state);
	const { currentWorkspace, setCurrentWorkspace } = useWorkspaceStore(
		(state) => state,
	);
	const { addTask } = useTaskStore((state) => state);

	const createTask = async (input: Partial<Task>) => {
		setIsLoading(true);
		setError(null);

		try {
			if (!currentWorkspace) {
				throw new Error("Error authenticating workspace");
			}
			if (!currentTeam) {
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

			const newTask: Partial<Task> = {
				...input,
				authorId: user.id,
				title: transformedTitle,
				description: transformedDescriptionInput,
				status: input.status ?? "backlog",
				priority: input.priority ?? "noPriority",
				labels: input.labels || [],
				dueDate: input.dueDate ?? null,
				effortEstimate: input.effortEstimate ?? null,
				teamId: currentTeam.id,
				workspaceId: currentWorkspace.id,
			};

			const {
				task: taskCreatedResponse,
				message,
				variant,
			} = await addTask(newTask);

			if (!taskCreatedResponse) {
				throw new Error("Failed to create task");
			}

			setCurrentWorkspace({
				...currentWorkspace,
				tasksCreated: currentWorkspace.tasksCreated + 1,
			});

			return { taskCreatedResponse, message, variant };
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
