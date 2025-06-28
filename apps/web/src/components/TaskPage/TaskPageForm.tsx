import { useOrganization } from "@clerk/nextjs";
import { Button } from "@squaredmade/ui/button";
import { Input } from "@squaredmade/ui/input";
import { toast } from "@squaredmade/ui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { type ChangeEvent, type FormEvent, useState } from "react";
import {
	convertMDXToSlate,
	convertSlateToMDX,
} from "@/components/TextEditor/format";
import { client } from "@/lib/client";
import { useEventStore, useTaskStore } from "@/store";
import { formatUrl } from "@/utils/formatting";
import { isCustomElement } from "@/utils/isCustomElement";
import { CustomMentionStyle } from "@/utils/mentionInputStyle";
import { transformingMentionInputs } from "@/utils/transformingMentionInputs";
import { StatusIcon } from "../Icons";
import TextEditor, {
	type CustomDescendant,
	type CustomElement,
} from "../TextEditor";

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
	const [updatedDescription, setUpdatedDescription] = useState<
		CustomDescendant[]
	>(convertMDXToSlate(task?.description ?? ""));
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
		onError: (error) => {
			toast.error("Error updating task", {
				description:
					error instanceof Error ? error.message : "An unknown error occurred",
			});
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
	});

	const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value.slice(0, 50);
		setUpdatedTitle(newValue);
	};
	const handleDescriptionChange = (event: CustomDescendant[]) => {
		setUpdatedDescription(event);
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		setIsEditingTitle(false);
		setIsDescriptionFocused(false);
		const { transformedInput: transformedTitleInput } =
			transformingMentionInputs(updatedTitle);

		const updatedDescriptionString =
			convertSlateToMDX(updatedDescription as CustomElement[]) || "";

		const { transformedInput: transformedDescriptionInput } =
			transformingMentionInputs(updatedDescriptionString);

		const changeMade =
			updatedTitle !== task?.title ||
			updatedDescriptionString !== task?.description;
		if (changeMade && task?.id) {
			updateTaskMutation.mutate({
				description: transformedDescriptionInput,
				title: transformedTitleInput,
			});
		}
	};

	return (
		<form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
			<div className="space-y-2">
				<Input
					className="mt-2 truncate rounded-lg bg-background font-bold text-3xl text-foreground focus:outline-hidden"
					maxLength={50}
					name="title"
					onBlur={handleSubmit}
					onChange={handleTitleChange}
					onFocus={() => setIsEditingTitle(true)}
					placeholder="Title"
					style={{
						border: "none",
						boxShadow: "none",
						lineHeight: "1.2",
						minHeight: "1.2em",
						padding: "0",
					}}
					value={updatedTitle}
				/>

				<p
					className={`text-end text-muted-foreground text-xs opacity-0 transition-opacity duration-200 ${isEditingTitle && "opacity-100"}`}
				>
					{updatedTitle.length ?? 0} / 50
				</p>

				{parentTask && (
					<div className="flex items-center gap-1 text-muted-foreground text-sm">
						Subtask of
						<Button className="gap-1 px-1 py-0" variant="ghost">
							<StatusIcon status={parentTask.status} />
							<Link
								className="flex items-center"
								href={`/${organization?.slug}/task/${parentTask?.identifier}/${formatUrl(parentTask.title)}`}
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

			<TextEditor
				value={updatedDescription.filter(
					(item) => isCustomElement(item) && item.children.length > 0,
				)}
				onChange={handleDescriptionChange}
				placeholder="Add description..."
				hasToolbar={false}
				onBlur={handleSubmit}
				onChange={handleDescriptionChange}
				onFocus={() => setIsDescriptionFocused(true)}
				placeholder="Add description..."
				style={CustomMentionStyle(isDescriptionFocused) as React.CSSProperties}
			/>
		</form>
	);
};
