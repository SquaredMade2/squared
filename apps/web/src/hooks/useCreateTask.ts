import { useState } from "react";
import {
	useAuthStore,
	useTeamStore,
	useWorkspaceStore,
	useTaskStore,
} from "@/store";
import { transformingMentionInputs } from "@/utils/transformingMentionInputs";
import type { Priority, Status, Task } from "@repo/db";

interface CreateTaskInput {
	title: string;
	description?: string;
	status?: Status;
	priority?: Priority;
	labels?: string[];
	dueDate?: Date | null;
	effortEstimate?: number | null;
}

export const useCreateTask = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { user } = useAuthStore((state) => state);
	const { currentTeam } = useTeamStore((state) => state);
	const { currentWorkspace, updateWorkspace, setCurrentWorkspace } =
		useWorkspaceStore((state) => state);
	const { addTask } = useTaskStore((state) => state);

	const createTask = async (input: CreateTaskInput) => {
		setIsLoading(true);
		setError(null);

		try {
			if (!currentWorkspace || !currentTeam || !user) {
				throw new Error("Error authenticating user");
			}

			const { transformedInput: transformedTitle } = transformingMentionInputs(
				input.title,
			);
			const { transformedInput: transformedDescriptionInput } =
				transformingMentionInputs(input.description ?? "");

			const newTask: Task = {
				authorId: user.id,
				title: transformedTitle,
				description: transformedDescriptionInput,
				identifier: `${currentTeam.identifier}-${currentWorkspace.tasksCreated + 1}`,
				status: input.status ?? "backlog",
				priority: input.priority ?? "noPriority",
				labels: input.labels || [],
				dueDate: input.dueDate ?? null,
				effortEstimate: input.effortEstimate ?? null,
				dateCreated: new Date(),
				assigneeId: null,
				assigneeName: "",
				teamId: currentTeam.id,
				id: "",
				workspaceId: currentWorkspace.id,
				updatedAt: new Date(),
				deleted: false,
				parentId: null,
			};

			const {
				task: taskCreatedResponse,
				message,
				variant,
			} = await addTask(newTask);

			if (!taskCreatedResponse) {
				throw new Error("Failed to create task");
			}

			await updateWorkspace(currentWorkspace.id, {
				tasksCreated: currentWorkspace.tasksCreated + 1,
			});

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
