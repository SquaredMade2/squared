import { useEffect, useState } from "react";
import MentionInput from "@/components/MentionsInput";
import { CustomMentionStyle } from "@/utils/mentionInputStyle";
import { transformingMentionInputs } from "@/utils/transformingMentionInputs";
import type { OnChangeHandlerFunc } from "react-mentions";
import { useToast } from "@/components/ui/use-toast";
import { useTaskStore, useUserStore, useWorkspaceStore } from "@/store";
import type { Task } from "@repo/db";

export const TaskPageForm = ({ task }: { task: Task }) => {
	const { updateTask } = useTaskStore((state) => state);
	const { users, getAllUsers } = useUserStore((state) => state);
	const { currentWorkspace } = useWorkspaceStore((state) => state);
	const { toast } = useToast();

	const [updatedTitle, setUpdatedTitle] = useState(task.title ?? "");
	const [updatedDescription, setUpdatedDescription] = useState(
		task.description ?? null,
	);
	const [isTitleFocused, setIsTitleFocused] = useState(false);
	const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);

	const { transformedInput: transformedTitleInput } = transformingMentionInputs(
		updatedTitle ?? "",
	);
	const { transformedInput: transformedDescriptionInput } =
		transformingMentionInputs(updatedDescription ?? "");

	const handleTitleChange: OnChangeHandlerFunc = (e) => {
		setUpdatedTitle(e.target.value);
	};
	const handleDescriptionChange: OnChangeHandlerFunc = (e) => {
		setUpdatedDescription(e.target.value);
	};

	const handleSubmit = async () => {
		setIsTitleFocused(false);
		setIsDescriptionFocused(false);
		const changeMade: boolean =
			updatedTitle !== task.title || updatedDescription !== task.description;
		if (changeMade && task.id !== undefined) {
			if (task) {
				const response = await updateTask(task.id, {
					title: transformedTitleInput,
					description: transformedDescriptionInput,
				});
				toast(response);
			}
		}
	};

	useEffect(() => {
		if (task) {
			setUpdatedTitle(task.title);
			setUpdatedDescription(task.description);
		}
		if (currentWorkspace) {
			getAllUsers(currentWorkspace.id);
		}
	}, [task]);

	return (
		<form className="flex flex-col" onSubmit={handleSubmit}>
			<MentionInput
				data={users}
				className="mt-2 text-foreground text-xl text-bold bg-background rounded-lg focus:outline-none"
				value={updatedTitle ?? ""}
				onChange={handleTitleChange}
				onBlur={handleSubmit}
				style={CustomMentionStyle(isTitleFocused)}
				onFocus={() => setIsTitleFocused(true)}
				placeholder={"Title"}
				name={"title"}
			/>
			<MentionInput
				data={users}
				onChange={handleDescriptionChange}
				className="resize-none mt-2 mb-2 text-foreground bg-card rounded-lg border border-transparent "
				placeholder={"Add description..."}
				value={updatedDescription ?? ""}
				name={"editDescription"}
				onBlur={handleSubmit}
				style={CustomMentionStyle(isDescriptionFocused)}
				onFocus={() => setIsDescriptionFocused(true)}
			/>
		</form>
	);
};
