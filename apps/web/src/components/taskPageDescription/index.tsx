import { useSelector } from "react-redux";
import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { getSingleTask } from "@/store/task/thunks";
import useLogTaskEvent from "@/hooks/useLogTaskEvent";
import MentionInput from "@/components/MentionsInput";
import { CustomMentionStyle } from "@/utils/mentionInputStyle";
import { transformingMentionInputs } from "@/utils/transformingMentionInputs";
import { SocketContext } from "@/app/SocketProvider";
import type { RootState } from "@/store";
import { useAppDispatch } from "@/hooks/typeScriptReduxHooks";
import { EventType } from "@/interfaces/event.interfaces";
import type { OnChangeHandlerFunc } from "react-mentions";
import { useToast } from "../ui/use-toast";
import { useTaskStore } from "@/storeZ";

const TaskPageDescription = () => {
	const dispatch = useAppDispatch();
	const { toast } = useToast();

	const currentTask = useTaskStore((state) => state.currentTask);
	const setCurrentTask = useTaskStore((state) => state.setCurrentTask);
	const updateTask = useTaskStore((state) => state.updateTask);

	const description = currentTask?.description ?? "";
	const taskId = currentTask?.id;

	const socket = useContext(SocketContext);

	const [updatedDescription, setUpdatedDescription] = useState(description);

	const {
		user,
		storeCommonFields,
		storeType,
		storeTaskValue,
		updateTaskValue,
	} = useLogTaskEvent();
	const [isFocused, setIsFocused] = useState(false);

	const listOfMembers = useSelector(
		(state: RootState) => state.listOfWorkspaceMembers.listOfWorkspaceMembers,
	);
	const handleChange: OnChangeHandlerFunc = (e) => {
		setUpdatedDescription(e.target.value);
	};

	const { transformedInput: transformedDescriptionInput } =
		transformingMentionInputs(updatedDescription ?? "");

	const updateDescription = async () => {
		if (taskId !== undefined) {
			try {
				// const updatedTaskDescription = await dispatch(
				// 	getSingleTask(taskId),
				// ).unwrap();
				if (currentTask) {
					const newTask = { ...currentTask };
					newTask.description = updatedDescription;
					const updatedTaskDescription = await updateTask(taskId, newTask);
					const { userIds: userId } = transformingMentionInputs(
						updatedDescription ?? "",
					);
					const mentionedUserIds = new Set([...userId]);
					socket.emit(
						"user_mentioned",
						[...mentionedUserIds],
						updatedTaskDescription.task?.id,
						user?.id,
					);
				}
			} catch (err) {
				if (err instanceof Error) {
					toast({
						title: "Error updating description",
						description: err?.message,
						variant: "destructive",
					});
				}
			}
		}
	};

	// disabled because waiting on events refactor, spammed api calls.
	const logEvent = () => {
		storeType(EventType.DescriptionUpdated);
		storeTaskValue(description ?? "");
		updateTaskValue(updatedDescription ?? "");
	};

	const handleBlur = () => {
		const changeMade = updatedDescription !== description;
		if (changeMade && taskId !== undefined) {
			storeCommonFields(user, taskId);
			// logEvent();
			updateDescription();
		}
		setIsFocused(false);
	};

	useEffect(() => {
		if (currentTask) {
			setUpdatedDescription(currentTask.description ?? "");
		}
	}, [currentTask]);

	return (
		<MentionInput
			data={listOfMembers}
			onChange={handleChange}
			className="resize-none mt-2 mb-2 text-foreground bg-card rounded-lg border border-transparent "
			placeholder={"Add description..."}
			value={transformedDescriptionInput}
			name={"editDescription"}
			onBlur={handleBlur}
			style={CustomMentionStyle(isFocused)}
			onFocus={() => setIsFocused(true)}
		/>
	);
};

export default TaskPageDescription;
