import { useOrganization } from "@clerk/nextjs";
import type { TaskEvent } from "@squaredmade/db";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { client } from "@/lib/client";
import { useCommentStore, useEventStore, useTaskStore } from "@/store";
import { parseError } from "@/utils/parseError";
import { parseParams } from "@/utils/parseParams";
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
		enabled: !!organization && isLoaded && !!taskIdentifier,
		queryFn: async () => {
			if (!organization) throw new Error("Workspace not found");
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
		queryKey: ["task", organization?.id, taskIdentifier],
	});

	const subtasksQuery = useQuery({
		enabled: !!taskQuery.data,
		queryFn: async () => {
			if (!taskQuery.data) throw new Error("Task not found");
			const res = await client.task.getSubtasks.$get({
				parentId: taskQuery.data.id,
			});
			const subtasksData = await res.json();
			setSubtasks(subtasksData);
			return subtasksData;
		},
		queryKey: ["task", "subtasks", taskQuery.data?.id],
	});

	const blockedByQuery = useQuery({
		enabled: !!taskQuery.data,
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
		queryKey: ["task", "blockedBy", taskQuery.data?.id],
	});

	const commentsQuery = useQuery({
		enabled: !!taskQuery.data,
		queryFn: async () => {
			if (!taskQuery.data) throw new Error("Task not found");
			const res = await client.comment.getComments.$get({
				taskId: taskQuery.data.id,
			});
			const comments = await res.json();
			setComments(comments);
			return comments;
		},
		queryKey: ["comment", taskQuery.data?.id],
	});

	const eventsQuery = useQuery({
		enabled: !!taskQuery.data,
		queryFn: async () => {
			if (!taskQuery.data) throw new Error("Task not found");
			const res = await client.event.getEvents.$get({
				taskId: taskQuery.data.id,
			});
			const events = await res.json();
			setEvents(events as TaskEvent[]);
			return events;
		},
		queryKey: ["event", "getEvents", taskQuery.data?.id],
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
		allBlockedTaskIds,
		currentTaskBlockedBy,
		currentTaskBlockingIds,
		error: error ? parseError(error, "Failed to fetch task") : null,
		isLoading,
		subtasks,
		task:
			taskQuery.data ||
			tasks.find((t) => t.identifier === taskIdentifier) ||
			null,
	};
}
