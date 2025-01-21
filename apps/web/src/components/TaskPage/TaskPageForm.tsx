import MentionInput from "@/components/MentionsInput";
import { client } from "@/lib/client";
import { eventService } from "@/lib/services";
import {
	useEventStore,
	useTaskStore,
	useUserStore,
	useWorkspaceStore,
} from "@/store";
import { formatUrl } from "@/utils/formatting";
import { CustomMentionStyle } from "@/utils/mentionInputStyle";
import { transformingMentionInputs } from "@/utils/transformingMentionInputs";
import { TODO } from "@squared/context";
import type { TaskEvent } from "@squared/db";
import { Button } from "@squaredmade/ui/button";
import { useToast } from "@squaredmade/ui/hooks";
import { Input } from "@squaredmade/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { type ChangeEvent, type FormEvent, useState } from "react";
import type { OnChangeHandlerFunc } from "react-mentions";
import { StatusIcon } from "../Icons";

export const TaskPageForm = () => {
	const { users } = useUserStore((state) => state);
	const workspace = useWorkspaceStore((state) => state.workspace);
	const {
		updateTask,
		currentTask: task,
		tasks,
		setCurrentTask,
	} = useTaskStore((state) => state);
	const { setEvents } = useEventStore((state) => state);
	const { toast } = useToast();
	const queryClient = useQueryClient();

	const [updatedTitle, setUpdatedTitle] = useState(task?.title ?? "");
	const [updatedDescription, setUpdatedDescription] = useState(
		task?.description ?? null,
	);
	const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);

	const parentTask = tasks.find((t) => t.id === task?.parentId);

	const updateTaskMutation = useMutation({
		mutationFn: async (data: { title?: string; description?: string }) => {
			if (!task) throw new Error("Task not found");
			const res = await client.task.updateMetadata.$post({
				taskId: task.id,
				...data,
			});
			return res.json();
		},
		onSuccess: async (updatedTask) => {
			updateTask(updatedTask);
			setCurrentTask(updatedTask);

			const updatedEvents = await eventService.getTaskEvents(TODO, {
				taskId: updatedTask.id,
			});
			// TODO: Will remove type coercion once commits are implemented
			setEvents(updatedEvents as TaskEvent[]);
			queryClient.invalidateQueries({ queryKey: ["taskEvents", task?.id] });
			toast({ title: "Task updated successfully" });
		},
		onError: (error) => {
			toast({
				title: "Error updating task",
				description:
					error instanceof Error ? error.message : "An unknown error occurred",
				variant: "destructive",
			});
		},
	});

	const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setUpdatedTitle(e.target.value);
	};

	const handleDescriptionChange: OnChangeHandlerFunc = (e) => {
		setUpdatedDescription(e.target.value);
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setIsDescriptionFocused(false);
		const { transformedInput: transformedTitleInput } =
			transformingMentionInputs(updatedTitle);
		const { transformedInput: transformedDescriptionInput } =
			transformingMentionInputs(updatedDescription ?? "");

		const changeMade =
			updatedTitle !== task?.title || updatedDescription !== task?.description;
		if (changeMade && task?.id) {
			updateTaskMutation.mutate({
				title: transformedTitleInput,
				description: transformedDescriptionInput,
			});
		}
	};

	return (
		<form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
			<div className="space-y-2">
				<Input
					className="mt-2 text-foreground text-3xl font-bold bg-background rounded-lg focus:outline-none"
					value={updatedTitle}
					onChange={handleTitleChange}
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
						Subtask of
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
