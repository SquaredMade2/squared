import { client } from "@/lib/client";
import {
	useCommentStore,
	useEventStore,
	useTaskStore,
	useUserStore,
} from "@/store";
import { parseError } from "@/utils/parseError";
import { parseParams } from "@/utils/parseParams";
import type { TaskEvent } from "@squared/db";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useTeams } from "./useTeams";
import { useWorkspaces } from "./useWorkspaces";

export function useTaskPage() {
	const { taskIdentifier } = useParams();
	const {
		workspace,
		loading: workspaceLoading,
		error: workspaceError,
	} = useWorkspaces();
	const { loading: teamLoading, error: teamError } = useTeams();
	const {
		tasks,
		setCurrentTask,
		subtasks,
		setSubtasks,
		currentTaskBlockingIds,
		setCurrentTaskBlockingIds,
		currentTaskBlockedBy,
		setCurrentTaskBlockedBy,
		allBlockedTaskIds,
	} = useTaskStore((state) => state);

	const { setComments } = useCommentStore((state) => state);
	const { setEvents } = useEventStore((state) => state);
	const { users } = useUserStore((state) => state);

	const taskQuery = useQuery({
		queryKey: ["task", workspace?.id, taskIdentifier],
		queryFn: async () => {
			if (!workspace) throw new Error("Workspace not found");
			const identifier = parseParams(taskIdentifier);
			if (!identifier) throw new Error("Task identifier not found");
			const res = await client.task.getTaskByIdentifier.$get({
				identifier,
			});
			const pageTask = await res.json();
			if (pageTask) {
				setCurrentTask(pageTask);
			}
			return pageTask;
		},
		enabled: !!workspace && !workspaceLoading && !!taskIdentifier,
	});

	const subtasksQuery = useQuery({
		queryKey: ["subtasks", taskQuery.data?.id],
		queryFn: async () => {
			if (!taskQuery.data) throw new Error("Task not found");
			const res = await client.task.getSubtasks.$get({
				parentId: taskQuery.data.id,
			});
			const subtasks = await res.json();
			setSubtasks(subtasks);
			return subtasks;
		},
		enabled: !!taskQuery.data,
	});

	const blockedByQuery = useQuery({
		queryKey: ["blockedBy", taskQuery.data?.id],
		queryFn: async () => {
			if (!taskQuery.data) throw new Error("Task not found");
			const res = await client.task.getTaskBlockedByAndBlocking.$get({
				taskId: taskQuery.data.id,
			});
			const blockedByTasks = await res.json();
			setCurrentTaskBlockedBy(blockedByTasks.blockedBy);
			setCurrentTaskBlockingIds(blockedByTasks.blockingIds);
			return blockedByTasks;
		},
		enabled: !!taskQuery.data,
	});

	const commentsQuery = useQuery({
		queryKey: ["comments", taskQuery.data?.id],
		queryFn: async () => {
			if (!taskQuery.data) throw new Error("Task not found");
			const res = await client.comment.getComments.$get({
				taskId: taskQuery.data.id,
			});
			const comments = await res.json();
			setComments(comments);
			return comments;
		},
		enabled: !!taskQuery.data,
	});

	const eventsQuery = useQuery({
		queryKey: ["events", taskQuery.data?.id],
		queryFn: async () => {
			if (!taskQuery.data) throw new Error("Task not found");
			const res = await client.event.getEvents.$get({
				taskId: taskQuery.data.id,
			});
			const events = await res.json();
			setEvents(events as TaskEvent[]);
			return events;
		},
		enabled: !!taskQuery.data,
	});

	const isLoading =
		workspaceLoading ||
		teamLoading ||
		taskQuery.isLoading ||
		subtasksQuery.isLoading ||
		commentsQuery.isLoading ||
		blockedByQuery.isLoading ||
		eventsQuery.isLoading;

	const error =
		workspaceError ||
		teamError ||
		taskQuery.error ||
		subtasksQuery.error ||
		commentsQuery.error ||
		blockedByQuery.error ||
		eventsQuery.error;

	return {
		workspace,
		users,
		task:
			taskQuery.data ||
			tasks.find((t) => t.identifier === taskIdentifier) ||
			null,
		isLoading,
		error: error ? parseError(error, "Failed to fetch task") : null,
		subtasks,
		currentTaskBlockedBy,
		currentTaskBlockingIds,
		allBlockedTaskIds,
	};
}
