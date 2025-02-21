import { client } from "@/lib/client";
import { useCommentStore, useEventStore, useTaskStore } from "@/store";
import { parseError } from "@/utils/parseError";
import { parseParams } from "@/utils/parseParams";
import { useOrganization } from "@clerk/nextjs";
import type { TaskEvent } from "@squared/db";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useTasks } from "./useTasks";
import { useTeams } from "./useTeams";

export function useTaskPage() {
	const { taskIdentifier } = useParams();
	const { organization, isLoaded } = useOrganization();
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

	const { loading: tasksLoading, error: tasksError } = useTasks();
	const { setComments } = useCommentStore((state) => state);
	const { setEvents } = useEventStore((state) => state);

	const taskQuery = useQuery({
		queryKey: ["task", organization?.id, taskIdentifier],
		queryFn: async () => {
			if (!organization) throw new Error("Workspace not found");
			const identifier = parseParams(taskIdentifier);
			if (!identifier) throw new Error("Task identifier not found");
			const res = await client.task.getTaskByIdentifier.$get({
				workspaceId: organization.id,
				identifier,
			});
			const pageTask = await res.json();
			if (pageTask) {
				setCurrentTask(pageTask);
			}
			return pageTask;
		},
		enabled: !!organization && isLoaded && !!taskIdentifier,
	});

	const subtasksQuery = useQuery({
		queryKey: ["task", "subtasks", taskQuery.data?.id],
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
		queryKey: ["task", "blockedBy", taskQuery.data?.id],
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
		queryKey: ["comment", taskQuery.data?.id],
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
		queryKey: ["event", "getEvents", taskQuery.data?.id],
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
		tasksLoading ||
		!isLoaded ||
		teamLoading ||
		taskQuery.isLoading ||
		subtasksQuery.isLoading ||
		commentsQuery.isLoading ||
		blockedByQuery.isLoading ||
		eventsQuery.isLoading;

	const error =
		tasksError ||
		teamError ||
		taskQuery.error ||
		subtasksQuery.error ||
		commentsQuery.error ||
		blockedByQuery.error ||
		eventsQuery.error;

	return {
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
