import { useToast } from "@/components/ui/use-toast";
import { client } from "@/lib/client";
import { eventService } from "@/lib/services";
import { useEventStore, useTaskStore, useWorkspaceStore } from "@/store";
import { formatUrl } from "@/utils/formatting";
import { CustomMentionStyle } from "@/utils/mentionInputStyle";
import { transformingMentionInputs } from "@/utils/transformingMentionInputs";
import { TODO } from "@squared/context";
import type { TaskEvent } from "@squared/db";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { StatusIcon } from "../Icons";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const TaskPageForm = () => {
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

	const handleDescriptionChange = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		setUpdatedDescription(event.target.value);
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
					className="mt-2 rounded-lg bg-background font-bold text-3xl text-foreground focus:outline-none"
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
					<div className="flex items-center gap-1 text-muted-foreground text-sm">
						Subtask of
						<Button variant="ghost" className="gap-1 px-1 py-0">
							<StatusIcon status={parentTask.status} />
							<Link
								href={`/${workspace?.url}/task/${parentTask?.identifier}/${formatUrl(parentTask.title)}`}
								className="flex items-center"
							>
								{parentTask.identifier} -
								<span className="ml-1 cursor-pointer text-foreground">
									{parentTask.title}
								</span>
							</Link>
						</Button>
					</div>
				)}
			</div>
			<Input
				className="mt-2 mb-2 resize-none rounded-lg border border-transparent bg-card p-2 text-foreground"
				placeholder={"Add description..."}
				onChange={handleDescriptionChange}
				value={updatedDescription ?? ""}
				name={"editDescription"}
				onBlur={handleSubmit}
				style={CustomMentionStyle(isDescriptionFocused) as React.CSSProperties}
				onFocus={() => setIsDescriptionFocused(true)}
			/>
		</form>
	);
};
