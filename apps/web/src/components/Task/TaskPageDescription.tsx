import { useState, useEffect } from "react";
import MentionInput from "@/components/MentionsInput";
import { CustomMentionStyle } from "@/utils/mentionInputStyle";
import { transformingMentionInputs } from "@/utils/transformingMentionInputs";
import type { OnChangeHandlerFunc } from "react-mentions";
import { useToast } from "../ui/use-toast";
import { useTaskStore, useUserStore, useWorkspaceStore } from "@/store";

const TaskPageDescription = () => {
	const [isFocused, setIsFocused] = useState(false);

	const { currentTask, updateTask } = useTaskStore((state) => state);
	const { users, getAllUsers } = useUserStore((state) => state);
	const { currentWorkspace } = useWorkspaceStore((state) => state);
	const { toast } = useToast();

	const description = currentTask?.description ?? "";
	const [updatedDescription, setUpdatedDescription] = useState(description);

	const handleChange: OnChangeHandlerFunc = (e) => {
		setUpdatedDescription(e.target.value);
	};

	const { transformedInput: transformedDescriptionInput } =
		transformingMentionInputs(updatedDescription ?? "");

	const updateDescription = async () => {
		if (currentTask?.id) {
			try {
				if (currentTask) {
					await updateTask(currentTask.id, {
						...currentTask,
						description: transformedDescriptionInput,
					});
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

	const handleBlur = () => {
		const changeMade = updatedDescription !== description;
		if (changeMade && currentTask?.id) {
			updateDescription();
		}
		setIsFocused(false);
	};

	useEffect(() => {
		if (currentTask) {
			setUpdatedDescription(currentTask.description ?? "");
		}
		if (currentWorkspace) {
			getAllUsers(currentWorkspace.id);
		}
	}, [currentTask]);

	return (
		<MentionInput
			data={users}
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
