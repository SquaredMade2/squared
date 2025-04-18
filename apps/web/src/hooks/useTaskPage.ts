import { useError } from "@/context/ErrorContext";
import { useLoading } from "@/context/LoadingContext";
import { client } from "@/lib/client";
import { useCommentStore, useEventStore, useTaskStore } from "@/store";
import { parseError } from "@/utils/parseError";
import { parseParams } from "@/utils/parseParams";
import { useOrganization } from "@clerk/nextjs";
import type { TaskEvent } from "@squaredmade/db";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useTasks } from "./useTasks";
import { useTeams } from "./useTeams";

export function useTaskPage() {
	const { taskIdentifier: rawTaskIdentifier } = useParams();
	const { organization, isLoaded } = useOrganization();
	const { loading: teamLoading, error: teamError } = useTeams();
	const {
		tasks,
		setCurrentTask,
		subtasks: storeSubtasks,
		setSubtasks,
		currentTaskBlockingIds: storeBlockingIds,
		setCurrentTaskBlockingIds,
		currentTaskBlockedBy: storeBlockedBy,
		setCurrentTaskBlockedBy,
		allBlockedTaskIds,
	} = useTaskStore((state) => state);

	const { loading: tasksLoading, error: tasksError } = useTasks();
	const { setComments } = useCommentStore((state) => state);
	const { setEvents } = useEventStore((state) => state);

	// Use the global loading and error contexts
	const { startLoading, stopLoading } = useLoading();
	const { setError, clearError } = useError();

	// Memoize the parsed task identifier
	const taskIdentifier = useMemo(
		() => parseParams(rawTaskIdentifier),
		[rawTaskIdentifier],
	);

	// Find task in existing tasks first to avoid unnecessary API call
	const existingTask = useMemo(
		() => tasks.find((t) => t.identifier === taskIdentifier),
		[tasks, taskIdentifier],
	);

	// Memoize the task fetch function
	const fetchTask = useCallback(async () => {
		if (!organization) throw new Error("Workspace not found");
		if (!taskIdentifier) throw new Error("Task identifier not found");

		// If we already have the task in the store, use that to avoid an unnecessary API call
		if (existingTask) return existingTask;

		const loadingKey = `task-${taskIdentifier}`;
		startLoading(loadingKey);
		clearError(loadingKey);

		try {
			const res = await client.task.getTaskByIdentifier.$get({
				identifier: taskIdentifier,
			});
			const pageTask = await res.json();

			if (pageTask) {
				setCurrentTask(pageTask);
			}

			return pageTask;
		} catch (error) {
			setError(loadingKey, error as Error);
			throw error;
		} finally {
			stopLoading(loadingKey);
		}
	}, [
		organization,
		taskIdentifier,
		existingTask,
		setCurrentTask,
		startLoading,
		stopLoading,
		setError,
		clearError,
	]);

	const taskQuery = useQuery({
		queryKey: ["task", organization?.id, taskIdentifier],
		queryFn: fetchTask,
		enabled: !!organization && isLoaded && !!taskIdentifier,
		// Use longer staleTime for task details that don't change frequently
		staleTime: 5 * 60 * 1000, // 5 minutes
		// Initialize with existing task data if available
		initialData: existingTask,
	});

	// Memoize the subtasks fetch function
	const fetchSubtasks = useCallback(async () => {
		if (!taskQuery.data) throw new Error("Task not found");

		const loadingKey = `subtasks-${taskQuery.data.id}`;
		startLoading(loadingKey);
		clearError(loadingKey);

		try {
			const res = await client.task.getSubtasks.$get({
				parentId: taskQuery.data.id,
			});
			const subtasks = await res.json();

			// Only update if different
			if (JSON.stringify(storeSubtasks) !== JSON.stringify(subtasks)) {
				setSubtasks(subtasks);
			}

			return subtasks;
		} catch (error) {
			setError(loadingKey, error as Error);
			throw error;
		} finally {
			stopLoading(loadingKey);
		}
	}, [
		taskQuery.data,
		storeSubtasks,
		setSubtasks,
		startLoading,
		stopLoading,
		setError,
		clearError,
	]);

	const subtasksQuery = useQuery({
		queryKey: ["task", "subtasks", taskQuery.data?.id],
		queryFn: fetchSubtasks,
		enabled: !!taskQuery.data,
		staleTime: 2 * 60 * 1000, // 2 minutes
	});

	// Memoize the blocked tasks fetch function
	const fetchBlockedTasks = useCallback(async () => {
		if (!taskQuery.data) throw new Error("Task not found");

		const loadingKey = `blocked-tasks-${taskQuery.data.id}`;
		startLoading(loadingKey);
		clearError(loadingKey);

		try {
			const res = await client.task.getTaskBlockedByAndBlocking.$get({
				taskId: taskQuery.data.id,
			});
			const blockedByTasks = await res.json();

			// Only update if different
			if (
				JSON.stringify(storeBlockedBy) !==
				JSON.stringify(blockedByTasks.blockedBy)
			) {
				setCurrentTaskBlockedBy(blockedByTasks.blockedBy);
			}

			if (
				JSON.stringify(storeBlockingIds) !==
				JSON.stringify(blockedByTasks.blockingIds)
			) {
				setCurrentTaskBlockingIds(blockedByTasks.blockingIds);
			}

			return blockedByTasks;
		} catch (error) {
			setError(loadingKey, error as Error);
			throw error;
		} finally {
			stopLoading(loadingKey);
		}
	}, [
		taskQuery.data,
		storeBlockedBy,
		storeBlockingIds,
		setCurrentTaskBlockedBy,
		setCurrentTaskBlockingIds,
		startLoading,
		stopLoading,
		setError,
		clearError,
	]);

	const blockedByQuery = useQuery({
		queryKey: ["task", "blockedBy", taskQuery.data?.id],
		queryFn: fetchBlockedTasks,
		enabled: !!taskQuery.data,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});

	// Memoize the comments fetch function
	const fetchComments = useCallback(async () => {
		if (!taskQuery.data) throw new Error("Task not found");

		const loadingKey = `comments-${taskQuery.data.id}`;
		startLoading(loadingKey);
		clearError(loadingKey);

		try {
			const res = await client.comment.getComments.$get({
				taskId: taskQuery.data.id,
			});
			const comments = await res.json();
			setComments(comments);
			return comments;
		} catch (error) {
			setError(loadingKey, error as Error);
			throw error;
		} finally {
			stopLoading(loadingKey);
		}
	}, [
		taskQuery.data,
		setComments,
		startLoading,
		stopLoading,
		setError,
		clearError,
	]);

	const commentsQuery = useQuery({
		queryKey: ["comment", taskQuery.data?.id],
		queryFn: fetchComments,
		enabled: !!taskQuery.data,
		// Comments might change frequently, so use a shorter staleTime
		staleTime: 1 * 60 * 1000, // 1 minute
	});

	// Memoize the events fetch function
	const fetchEvents = useCallback(async () => {
		if (!taskQuery.data) throw new Error("Task not found");

		const loadingKey = `events-${taskQuery.data.id}`;
		startLoading(loadingKey);
		clearError(loadingKey);

		try {
			const res = await client.event.getEvents.$get({
				taskId: taskQuery.data.id,
			});
			const events = await res.json();
			setEvents(events as TaskEvent[]);
			return events;
		} catch (error) {
			setError(loadingKey, error as Error);
			throw error;
		} finally {
			stopLoading(loadingKey);
		}
	}, [
		taskQuery.data,
		setEvents,
		startLoading,
		stopLoading,
		setError,
		clearError,
	]);

	const eventsQuery = useQuery({
		queryKey: ["event", "getEvents", taskQuery.data?.id],
		queryFn: fetchEvents,
		enabled: !!taskQuery.data,
		staleTime: 2 * 60 * 1000, // 2 minutes
	});

	// Memoize computed values
	const isLoading = useMemo(
		() =>
			tasksLoading ||
			!isLoaded ||
			teamLoading ||
			taskQuery.isLoading ||
			subtasksQuery.isLoading ||
			commentsQuery.isLoading ||
			blockedByQuery.isLoading ||
			eventsQuery.isLoading,
		[
			tasksLoading,
			isLoaded,
			teamLoading,
			taskQuery.isLoading,
			subtasksQuery.isLoading,
			commentsQuery.isLoading,
			blockedByQuery.isLoading,
			eventsQuery.isLoading,
		],
	);

	const error = useMemo(
		() =>
			tasksError ||
			teamError ||
			taskQuery.error ||
			subtasksQuery.error ||
			commentsQuery.error ||
			blockedByQuery.error ||
			eventsQuery.error,
		[
			tasksError,
			teamError,
			taskQuery.error,
			subtasksQuery.error,
			commentsQuery.error,
			blockedByQuery.error,
			eventsQuery.error,
		],
	);

	const errorMessage = useMemo(
		() => (error ? parseError(error, "Failed to fetch task") : null),
		[error],
	);

	// Return memoized result
	return useMemo(
		() => ({
			task: taskQuery.data || existingTask || null,
			isLoading,
			error: errorMessage,
			subtasks: subtasksQuery.data || storeSubtasks,
			currentTaskBlockedBy: blockedByQuery.data?.blockedBy || storeBlockedBy,
			currentTaskBlockingIds:
				blockedByQuery.data?.blockingIds || storeBlockingIds,
			allBlockedTaskIds,
		}),
		[
			taskQuery.data,
			existingTask,
			isLoading,
			errorMessage,
			subtasksQuery.data,
			storeSubtasks,
			blockedByQuery.data?.blockedBy,
			storeBlockedBy,
			blockedByQuery.data?.blockingIds,
			storeBlockingIds,
			allBlockedTaskIds,
		],
	);
}
