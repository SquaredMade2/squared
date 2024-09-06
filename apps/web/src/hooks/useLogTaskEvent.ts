import { useState, useEffect } from "react";
import type { ActivityType, TaskEvent, TaskEventLog, User } from "@repo/db";
import { useActivityStore, useAuthStore } from "@/storeZ";

const useLogTaskEvent = () => {
	const [taskEvent, setTaskEvent] = useState<TaskEvent>({
		type: "",
		authorId: "",
		taskId: "",
		createdAt: new Date(),
		originalLabels: [],
		updatedLabels: [],
		originalValue: "",
		updatedValue: "",
		originalAssigneeId: "",
		updatedAssigneeId: "",
		id: "",
		authorName: "",
		activityId: "",
		originalAssigneeName: "",
		updatedAssigneeName: "",
		gitUpdated: "",
	});
	const [valueUpdated, setValueUpdated] = useState(false);
	const [assigneeUpdated, setAssigneeUpdated] = useState(false);
	const [labelsUpdated, setLabelsUpdated] = useState(false);

	const user = useAuthStore((state) => state.user);
	const addTaskEvent = useActivityStore((state) => state.addTaskEvent);

	useEffect(() => {
		if (valueUpdated) {
			handleValueUpdated();
		}
		if (assigneeUpdated) {
			handleAssigneeUpdate();
		}
		if (labelsUpdated) {
			handleLabelsUpdated();
		}
	}, [taskEvent]);

	const storeCommonFields = (author: User | null, taskId: string) => {
		setTaskEvent({
			...taskEvent,
			authorId: author?.id ?? "",
			taskId,
		});
	};

	const storeType = (type: string) => {
		setTaskEvent((taskEvent) => ({
			...taskEvent,
			type,
		}));
	};

	const storeCommentRef = (commentRef: string) => {
		setTaskEvent((taskEvent) => ({
			...taskEvent,
			commentRef: commentRef,
		}));
	};

	// const storeTaskLabels = (originalLabels: Labels[]) => {
	// 	setTaskEvent((taskEvent) => ({
	// 		...taskEvent,
	// 		originalLabels,
	// 	}));
	// };

	const storeTaskValue = (originalValue: string) => {
		setTaskEvent((taskEvent) => ({
			...taskEvent,
			originalValue,
		}));
	};

	const storeTaskAssignee = (assignee: User) => {
		setTaskEvent((taskEvent) => ({
			...taskEvent,
			originalAssignee: assignee,
		}));
	};

	// const updateTaskLabels = (updatedLabels: Labels[]) => {
	// 	setTaskEvent((taskEvent) => ({
	// 		...taskEvent,
	// 		updatedLabels,
	// 		updatedAt: new Date(),
	// 	}));
	// 	setLabelsUpdated(true);
	// };

	const updateTaskAssignee = (assignee: User) => {
		setTaskEvent((taskEvent) => ({
			...taskEvent,
			updatedAssignee: assignee,
			updatedAt: new Date(),
		}));
		setAssigneeUpdated(true);
	};

	const updateTaskValue = (updatedValue: string) => {
		setTaskEvent((taskEvent) => ({
			...taskEvent,
			updatedValue,
			updatedAt: new Date(),
		}));
		setValueUpdated(true);
	};

	const resetUpdatedTaskLabels = () => {
		setTaskEvent((taskEvent) => ({
			...taskEvent,
			updatedLabels: [],
			updatedAt: null,
		}));
		setLabelsUpdated(false);
	};
	const resetUpdatedTaskValue = () => {
		setTaskEvent((taskEvent) => ({
			...taskEvent,
			updatedValue: "",
			updatedAt: null,
		}));
		setValueUpdated(false);
	};

	const handleLabelsUpdated = () => {
		addTaskEvent(taskEvent, taskEvent.taskId, user?.id ?? "");
		resetUpdatedTaskLabels();
	};

	const handleValueUpdated = () => {
		addTaskEvent(taskEvent, taskEvent.taskId, user?.id ?? "");
		taskEvent.updatedValue && storeTaskValue(taskEvent.updatedValue);
		resetUpdatedTaskValue();
	};

	const handleAssigneeUpdate = () => {
		addTaskEvent(taskEvent, taskEvent.taskId, user?.id ?? "");
		setAssigneeUpdated(false);
	};

	const resetTaskEvent = () => {
		setTaskEvent({
			type: "",
			authorId: "",
			taskId: "",
			createdAt: new Date(),
			originalLabels: [],
			updatedLabels: [],
			originalValue: "",
			updatedValue: "",
			originalAssigneeId: "",
			updatedAssigneeId: "",
			id: "",
			authorName: "",
			activityId: "",
			originalAssigneeName: "",
			updatedAssigneeName: "",
			gitUpdated: "",
		});
	};

	return {
		handleLabelsUpdated,
		taskEvent,
		storeCommonFields,
		storeType,
		storeCommentRef,
		storeTaskAssignee,
		storeTaskValue,
		updateTaskAssignee,
		updateTaskValue,
		resetTaskEvent,
		user,
	};
};

export default useLogTaskEvent;
