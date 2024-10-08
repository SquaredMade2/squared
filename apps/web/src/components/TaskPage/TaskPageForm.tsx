import { useEffect, useState, type ChangeEvent } from "react";
import MentionInput from "@/components/MentionsInput";
import { CustomMentionStyle } from "@/utils/mentionInputStyle";
import { transformingMentionInputs } from "@/utils/transformingMentionInputs";
import type { OnChangeHandlerFunc } from "react-mentions";
import { useToast } from "@/components/ui/use-toast";
import { useTaskStore, useUserStore, useWorkspaceStore } from "@/store";
import type { Task } from "@repo/db";
import { Input } from "../ui/input";
import { StatusIcon } from "../Icons";
import Link from "next/link";
import { formatUrl } from "@/utils/formatting";
import { Button } from "../ui/button";

export const TaskPageForm = ({ task }: { task: Task }) => {
	const { updateTask, getTask } = useTaskStore((state) => state);
	const { users, getAllUsers } = useUserStore((state) => state);
	const { currentWorkspace } = useWorkspaceStore((state) => state);
	const { toast } = useToast();

	const [updatedTitle, setUpdatedTitle] = useState(task.title ?? "");
	const [updatedDescription, setUpdatedDescription] = useState(
		task.description ?? null,
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

	useEffect(() => {
		const fetchParentTask = async () => {
			if (task.parentId) {
				const { task: parentTaskData } = await getTask(task.parentId);
				setParentTask(parentTaskData);
			}
		};

		fetchParentTask();
	}, [task.parentId]);

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
								href={`/${currentWorkspace?.url}/task/${parentTask?.identifier}/${formatUrl(parentTask.title)}`}
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
