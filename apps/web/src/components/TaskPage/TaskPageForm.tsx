import { client } from "@/lib/client";
import { useEventStore, useTaskStore } from "@/store";
import { formatUrl } from "@/utils/formatting";
import { CustomMentionStyle } from "@/utils/mentionInputStyle";
import { transformingMentionInputs } from "@/utils/transformingMentionInputs";
import { useOrganization } from "@clerk/nextjs";
import { Button } from "@squaredmade/ui/button";
import { Input } from "@squaredmade/ui/input";
import { Textarea } from "@squaredmade/ui/textarea";
import { toast } from "@squaredmade/ui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { StatusIcon } from "../Icons";

export const TaskPageForm = () => {
	const { organization } = useOrganization();
	const {
		updateTask,
		currentTask: task,
		tasks,
		setCurrentTask,
	} = useTaskStore((state) => state);
	const { setEvents } = useEventStore((state) => state);
	const queryClient = useQueryClient();

	const [updatedTitle, setUpdatedTitle] = useState(task?.title ?? "");
	const [isEditingTitle, setIsEditingTitle] = useState(false);
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

			const updatedEvents = await client.event.getEvents
				.$get({
					taskId: updatedTask.id,
				})
				.then((res) => res.json());
			setEvents(updatedEvents);
			queryClient.invalidateQueries({ queryKey: ["event", task?.id] });
			toast.success("Task updated successfully");
		},
		onError: (error) => {
			toast.error("Error updating task", {
				description:
					error instanceof Error ? error.message : "An unknown error occurred",
			});
		},
	});

	const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value.slice(0, 50);
		setUpdatedTitle(newValue);
	};

	const handleDescriptionChange = (
		event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		setUpdatedDescription(event.target.value);
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setIsEditingTitle(false);
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
					className="mt-2 truncate rounded-lg bg-background font-bold text-3xl text-foreground focus:outline-hidden"
					value={updatedTitle}
					onChange={handleTitleChange}
					onBlur={handleSubmit}
					onFocus={() => setIsEditingTitle(true)}
					placeholder="Title"
					name="title"
					maxLength={50}
					style={{
						border: "none",
						boxShadow: "none",
						padding: "0",
						lineHeight: "1.2",
						minHeight: "1.2em",
					}}
				/>

				<p
					className={`text-end text-muted-foreground text-xs opacity-0 transition-opacity duration-200 ${isEditingTitle && "opacity-100"}`}
				>
					{updatedTitle.length ?? 0} / 50
				</p>

				{parentTask && (
					<div className="flex items-center gap-1 text-muted-foreground text-sm">
						Subtask of
						<Button variant="ghost" className="gap-1 px-1 py-0">
							<StatusIcon status={parentTask.status} />
							<Link
								href={`/${organization?.slug}/task/${parentTask?.identifier}/${formatUrl(parentTask.title)}`}
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
			<Textarea
				className="mt-2 mb-2 min-h-40 resize-none rounded-lg border border-transparent bg-card p-2 text-foreground"
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
