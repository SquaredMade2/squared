import { useState, type FocusEvent } from "react";
import { useSelector } from "react-redux";
import TaskPageDescription from "@/components/taskPageDescription/index";
import useLogTaskEvent from "@/hooks/useLogTaskEvent";
import MentionInput from "@/components/MentionsInput";
import { CustomMentionStyle } from "@/utils/mentionInputStyle";
import { transformingMentionInputs } from "@/utils/transformingMentionInputs";
import { useAppDispatch } from "@/hooks/typeScriptReduxHooks";
import type { RootState } from "@/store";
import { EventType } from "@/interfaces/event.interfaces";
import type { OnChangeHandlerFunc } from "react-mentions";
import { useToast } from "@/components/ui/use-toast";
import { useSquaredStore } from "@/storeZ/provider";

const TaskPageTitle = () => {
	const { toast } = useToast();
	const dispatch = useAppDispatch();
	const { updateTask } = useSquaredStore((state) => state.tasks);

	const title = useSelector((state: RootState) => state.singleTask.data?.title);
	const taskId = useSelector((state: RootState) => state.singleTask.data?._id);
	const taskListTitle = useSelector((state: RootState) =>
		state.taskData.taskList.map((el) => el.title),
	);
	const [updatedTitle, setUpdatedTitle] = useState(title);
	const [isFocused, setIsFocused] = useState(false);
	const {
		author,
		storeCommonFields,
		storeType,
		storeTaskValue,
		updateTaskValue,
	} = useLogTaskEvent();

	const styles = {
		container: "flex flex-col",
		title:
			"mt-2 text-foreground text-xl text-bold bg-background rounded-lg focus:outline-none",
	};

	const listOfMembers = useSelector(
		(state: RootState) => state.listOfWorkspaceMembers.listOfWorkspaceMembers,
	);

	const { transformedInput: transformedTitleInput } = transformingMentionInputs(
		updatedTitle ?? "",
	);

	const handleChange: OnChangeHandlerFunc = (e) => {
		setUpdatedTitle(e.target.value);
	};

	const logEvent = () => {
		storeType(EventType.TitleUpdated);
		if (taskId !== undefined) storeTaskValue(title ?? "");
		updateTaskValue(updatedTitle ?? "");
	};

	const handleSubmit = async (e: FocusEvent<HTMLFormElement>) => {
		setIsFocused(false);
		e.preventDefault();
		const changeMade: boolean = updatedTitle !== title;
		if (changeMade && taskId !== undefined) {
			storeCommonFields(author, taskId);
			logEvent();
			await updateTask(taskId, { title: updatedTitle });
		}
	};

	const handleBlur = async (
		e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		setIsFocused(false);
		e.preventDefault();
		if (
			taskListTitle.includes(updatedTitle === undefined ? "" : updatedTitle)
		) {
			toast({
				title: `${updatedTitle} already exists`,
				variant: "destructive",
			});
			return;
		}
		const changeMade: boolean = updatedTitle !== title;
		if (changeMade && taskId !== undefined) {
			storeCommonFields(author, taskId);
			logEvent();
			await updateTask(taskId, { title: updatedTitle });
		}
	};
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
