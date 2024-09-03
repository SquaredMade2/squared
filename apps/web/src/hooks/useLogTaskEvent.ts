import { useState, useEffect } from "react";
import type {
	Assignee,
	Author,
	EventType,
	Labels,
} from "@/interfaces/event.interfaces";
import { addTaskEvent } from "@/store/events/actions";
import { useAppSelector, useAppDispatch } from "./typeScriptReduxHooks";
import type { TaskEvent } from "@repo/db";

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
	});
	const [valueUpdated, setValueUpdated] = useState(false);
	const [assigneeUpdated, setAssigneeUpdated] = useState(false);
	const [labelsUpdated, setLabelsUpdated] = useState(false);

	const dispatch = useAppDispatch();

	const { _id: userId, name: userName } = useAppSelector(
		(state) => state.userSettings.user,
	);

	const author: Author = {
		id: userId,
		name: userName,
	};

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

	const storeCommonFields = (author: Author, taskId: string) => {
		setTaskEvent({
			...taskEvent,
			authorId: author.id,
			taskId,
		});
	};

	const storeType = (type: EventType) => {
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

	const storeTaskAssignee = (assignee: Assignee) => {
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

	const updateTaskAssignee = (assignee: Assignee) => {
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
		dispatch(addTaskEvent(taskEvent));
		resetUpdatedTaskLabels();
	};

	const handleValueUpdated = () => {
		dispatch(addTaskEvent(taskEvent));
		taskEvent.updatedValue && storeTaskValue(taskEvent.updatedValue);
		resetUpdatedTaskValue();
	};

	const handleAssigneeUpdate = () => {
		dispatch(addTaskEvent(taskEvent));
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
		});
	};

	return {
		author,
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
	};
};

export default useLogTaskEvent;
