import MentionInput from "@/components/MentionsInput";
import { useToast } from "@/components/ui/use-toast";
import { taskService } from "@/lib/services";
import { useTaskStore, useUserStore, useWorkspaceStore } from "@/store";
import { formatUrl } from "@/utils/formatting";
import { CustomMentionStyle } from "@/utils/mentionInputStyle";
import { transformingMentionInputs } from "@/utils/transformingMentionInputs";
import { TODO } from "@squared/context";
import type { Task } from "@squared/db";
import Link from "next/link";
import { type ChangeEvent, useEffect, useState } from "react";
import type { OnChangeHandlerFunc } from "react-mentions";
import { StatusIcon } from "../Icons";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const TaskPageForm = () => {
	const { users } = useUserStore((state) => state);
	const workspace = useWorkspaceStore((state) => state.workspace);
	const task = useTaskStore((state) => state.currentTask);
	const { updateTask } = useTaskStore((state) => state);
	const { toast } = useToast();

	const [updatedTitle, setUpdatedTitle] = useState(task?.title ?? "");
	const [updatedDescription, setUpdatedDescription] = useState(
		task?.description ?? null,
	);
	const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);
	const [parentTask, setParentTask] = useState<Task | null>(null);

	const { transformedInput: transformedTitleInput } = transformingMentionInputs(
		updatedTitle ?? "",
	);
	const { transformedInput: transformedDescriptionInput } =
		transformingMentionInputs(updatedDescription ?? "");

	const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setUpdatedTitle(e.target.value);
	};
	const handleDescriptionChange: OnChangeHandlerFunc = (e) => {
		setUpdatedDescription(e.target.value);
	};

	const handleSubmit = async () => {
		setIsDescriptionFocused(false);
		const changeMade: boolean =
			updatedTitle !== task?.title || updatedDescription !== task?.description;
		if (changeMade && task?.id !== undefined) {
			if (task) {
				try {
					updateTask(
						await taskService.updateTask(TODO, {
							id: task.id,
							title: transformedTitleInput,
							description: transformedDescriptionInput,
						}),
					);
					toast({ title: "title updated successfully" });
				} catch (error) {
					toast({
						title: "Error updating task",
						description: error instanceof Error && error.message,
					});
				}
			}
		}
	};

	useEffect(() => {
		if (task) {
			setUpdatedTitle(task.title);
			setUpdatedDescription(task.description);
		}
	}, [task]);

	useEffect(() => {
		const fetchParentTask = async () => {
			if (task?.parentId) {
				try {
					const parentTaskData = await taskService.getTask(TODO, {
						taskId: task.parentId,
					});
					setParentTask(parentTaskData);
				} catch (error) {
					toast({
						title: "Error retrieving task",
						description: error instanceof Error && error.message,
					});
				}
			}
		};

		fetchParentTask();
	}, [task?.parentId]);

	return (
		<form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
			<div className="space-y-2">
				<Input
					className="mt-2 text-foreground text-3xl font-bold bg-background rounded-lg focus:outline-none"
					value={updatedTitle ?? ""}
					onChange={(e) => handleTitleChange(e)}
					onBlur={handleSubmit}
					placeholder="Title"
					name="title"
					style={{
						border: "none",
						boxShadow: "none",
						padding: "0",
						lineHeight: "1.2",
						minHeight: "1.2em",
					}}
				/>
				{parentTask && (
					<div className="text-sm text-muted-foreground flex items-center gap-1">
						Subissue of
						<Button variant="ghost" className="py-0 px-1 gap-1">
							<StatusIcon status={parentTask.status} />
							<Link
								href={`/${workspace?.url}/task/${parentTask?.identifier}/${formatUrl(parentTask.title)}`}
								className="flex items-center"
							>
								{parentTask.identifier} -
								<span className="text-foreground ml-1 cursor-pointer">
									{parentTask.title}
								</span>
							</Link>
						</Button>
					</div>
				)}
			</div>
			<MentionInput
				data={users}
				onChange={handleDescriptionChange}
				className="resize-none mt-2 mb-2 text-foreground bg-card rounded-lg border border-transparent p-2"
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
