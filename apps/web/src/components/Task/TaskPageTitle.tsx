import { useEffect, useState } from "react";
import TaskPageDescription from "./TaskPageDescription";
import MentionInput from "@/components/MentionsInput";
import { CustomMentionStyle } from "@/utils/mentionInputStyle";
import { transformingMentionInputs } from "@/utils/transformingMentionInputs";
import type { OnChangeHandlerFunc } from "react-mentions";
import { useToast } from "@/components/ui/use-toast";
import { useTaskStore, useUserStore, useWorkspaceStore } from "@/store";

const TaskPageTitle = () => {
	const { toast } = useToast();

	const { currentTask, updateTask } = useTaskStore((state) => state);
	const { users, getAllUsers } = useUserStore((state) => state);
	const { currentWorkspace } = useWorkspaceStore((state) => state);

	const title = currentTask?.title ?? "";
	const taskId = currentTask?.id;

	const [updatedTitle, setUpdatedTitle] = useState(title);
	const [isFocused, setIsFocused] = useState(false);

	const { transformedInput: transformedTitleInput } = transformingMentionInputs(
		updatedTitle ?? "",
	);

	const handleChange: OnChangeHandlerFunc = (e) => {
		setUpdatedTitle(e.target.value);
	};

	const handleSubmit = async () => {
		const changeMade: boolean = updatedTitle !== title;
		if (changeMade && taskId !== undefined) {
			if (currentTask) {
				const response = await updateTask(taskId, {
					...currentTask,
					title: transformedTitleInput,
				});
				toast(response);
			}
		}
	};

	useEffect(() => {
		if (currentTask) {
			setUpdatedTitle(currentTask.title);
		}
		if (currentWorkspace) {
			getAllUsers(currentWorkspace.id);
		}
	}, [currentTask]);

	return (
		<form className="flex flex-col" onSubmit={handleSubmit}>
			<MentionInput
				data={users}
				className="mt-2 text-foreground text-xl text-bold bg-background rounded-lg focus:outline-none"
				value={updatedTitle ?? ""}
				onChange={handleChange}
				onBlur={handleSubmit}
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
