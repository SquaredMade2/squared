import { useEffect, useState, type FocusEvent } from "react";
import { useSelector } from "react-redux";
import TaskPageDescription from "@/components/taskPageDescription/index";
import { updateTitle } from "@/api/taskApi";
import useLogTaskEvent from "@/hooks/useLogTaskEvent";
import MentionInput from "@/components/MentionsInput";
import { CustomMentionStyle } from "@/utils/mentionInputStyle";
import { transformingMentionInputs } from "@/utils/transformingMentionInputs";
import { useAppDispatch } from "@/hooks/typeScriptReduxHooks";
import type { RootState } from "@/store";
import { EventType } from "@/interfaces/event.interfaces";
import type { OnChangeHandlerFunc } from "react-mentions";
import { useToast } from "@/components/ui/use-toast";
import { useTaskStore } from "@/storeZ";
import type { Task } from "@repo/db";

const TaskPageTitle = () => {
	const { toast } = useToast();
	const dispatch = useAppDispatch();

	// const title = useSelector((state: RootState) => state.singleTask.data?.title);
	// const taskId = useSelector((state: RootState) => state.singleTask.data?._id);
	// const taskListTitle = useSelector((state: RootState) =>
	// 	state.taskData.taskList.map((el) => el.title),
	// );

	const currentTask = useTaskStore((state) => state.currentTask);
	const taskListTitle = useTaskStore((state) => state.tasks).map(
		(task) => task.title,
	);
	const updateTask = useTaskStore((state) => state.updateTask);
	const setCurrentTask = useTaskStore((state) => state.setCurrentTask);

	const title = currentTask?.title ?? "";
	const taskId = currentTask?.id;

	const [updatedTitle, setUpdatedTitle] = useState(title);
	const [isFocused, setIsFocused] = useState(false);
	const {
		storeCommonFields,
		storeType,
		storeTaskValue,
		updateTaskValue,
		user,
	} = useLogTaskEvent();

	const listOfMembers = useSelector(
		(state: RootState) => state.listOfWorkspaceMembers.listOfWorkspaceMembers,
	);

	const { transformedInput: transformedTitleInput } = transformingMentionInputs(
		updatedTitle ?? "",
	);

	const handleChange: OnChangeHandlerFunc = (e) => {
		setUpdatedTitle(e.target.value);
	};

	// disabled because waiting on events refactor, spammed api calls.
	const logEvent = () => {
		storeType(EventType.TitleUpdated);
		if (taskId !== undefined) storeTaskValue(title ?? "");
		updateTaskValue(updatedTitle ?? "");
	};

	const handleUpdateTask = async (taskId: string, newTask: Task) => {
		try {
			await updateTask(taskId, newTask);
		} catch (err) {
			if (err instanceof Error) {
				toast({
					title: "Error updating description",
					description: err?.message,
					variant: "destructive",
				});
			}
		}
	};

	const handleSubmit = async (e: FocusEvent<HTMLFormElement>) => {
		setIsFocused(false);
		e.preventDefault();
		const changeMade: boolean = updatedTitle !== title;
		if (changeMade && taskId !== undefined) {
			storeCommonFields(user, taskId);
			// logEvent();
			// dispatch(updateTitle(transformedTitleInput, taskId));
			if (currentTask) {
				const newTask = { ...currentTask };
				newTask.title = transformedTitleInput;
				handleUpdateTask(taskId, newTask);
				setCurrentTask(newTask);
			}
		}
	};

	const handleBlur = async (
		e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		setIsFocused(false);
		e.preventDefault();
		// Dont need this, because it's already handled with changeMade
		// if (
		// 	taskListTitle.includes(updatedTitle === undefined ? "" : updatedTitle)
		// ) {
		// 	toast({
		// 		title: `${updatedTitle} already exists`,
		// 		variant: "destructive",
		// 	});
		// 	return;
		// }
		const changeMade: boolean = updatedTitle !== title;
		if (changeMade && taskId !== undefined) {
			storeCommonFields(user, taskId);
			// logEvent();
			// dispatch(updateTitle(transformedTitleInput, taskId));
			if (currentTask) {
				const newTask = { ...currentTask };
				newTask.title = transformedTitleInput;
				await updateTask(taskId, newTask);
				setCurrentTask(newTask);
			}
		}
	};

	useEffect(() => {
		if (currentTask) {
			setUpdatedTitle(currentTask.title);
		}
	}, [currentTask]);

	return (
		<form className="flex flex-col" onSubmit={handleSubmit}>
			<MentionInput
				data={listOfMembers}
				className="mt-2 text-foreground text-xl text-bold bg-background rounded-lg focus:outline-none"
				value={updatedTitle ?? ""}
				onChange={handleChange}
				onBlur={handleBlur}
				style={CustomMentionStyle(isFocused)}
				onFocus={() => setIsFocused(true)}
				placeholder={"Title"}
				name={"title"}
			/>
			<TaskPageDescription />
		</form>
	);
};

export default TaskPageTitle;
