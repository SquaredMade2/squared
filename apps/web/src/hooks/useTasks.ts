import { useError } from "@/context/ErrorContext";
import { useLoading } from "@/context/LoadingContext";
import { client } from "@/lib/client";
import { useTaskStore } from "@/store";
import { parseError } from "@/utils/parseError";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useTeams } from "./useTeams";

export function useTasks() {
	const { team, loading: teamLoading } = useTeams();
	const { tasks: storeTasks, setTasks } = useTaskStore((state) => state);

	// Use the global loading and error contexts
	const { startLoading, stopLoading } = useLoading();
	const { setError, clearError } = useError();

	// Memoize fetch function to stabilize dependencies
	const fetchTasks = useCallback(async () => {
		if (!team) throw new Error("Team not found");

		const loadingKey = `tasks-${team.id}`;
		startLoading(loadingKey);
		clearError(loadingKey);

		try {
			const res = await client.task.getAllTasks.$get({
				teamId: team.id,
			});
			const tasks = await res.json();

			// Only update store if data has changed
			if (JSON.stringify(storeTasks) !== JSON.stringify(tasks)) {
				setTasks(tasks);
			}

			return tasks;
		} catch (error) {
			setError(loadingKey, error as Error);
			throw error;
		} finally {
			stopLoading(loadingKey);
		}
	}, [
		team,
		storeTasks,
		setTasks,
		startLoading,
		stopLoading,
		setError,
		clearError,
	]);

	const {
		data: tasks,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["tasks", team?.id],
		queryFn: fetchTasks,
		enabled: !!team && !teamLoading,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});

	// Memoize computed values
	const loading = useMemo(
		() => isLoading || teamLoading,
		[isLoading, teamLoading],
	);
	const errorMessage = useMemo(
		() => (error ? parseError(error, "Failed to fetch tasks") : null),
		[error],
	);
	const tasksList = useMemo(
		() => tasks || storeTasks || [],
		[tasks, storeTasks],
	);

	// Return memoized result
	return useMemo(
		() => ({
			loading,
			tasks: tasksList,
			error: errorMessage,
		}),
		[loading, tasksList, errorMessage],
	);
}
