import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { CirclePlus } from "@squaredmade/icons";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@squaredmade/ui/accordion";
import { Button } from "@squaredmade/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@squaredmade/ui/form";
import { Input } from "@squaredmade/ui/input";
import { Textarea } from "@squaredmade/ui/textarea";
import { toast } from "@squaredmade/ui/toast";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { client } from "@/lib/client";
import {
	useModalStore,
	useTaskStore,
	useTeamStore,
	useWorkspaceStore,
} from "@/store";
import { transformingMentionInputs } from "@/utils/transformingMentionInputs";
import { DateDropdownButton } from "./date-dropdown-button";
import { EffortDropdownButton } from "./effort-dropdown-button";
import { LabelDropdownButton } from "./label-dropdown-button";
import { PriorityDropdownButton } from "./priority-dropdown-button";
import { StatusDropdownButton } from "./status-dropdown-button";

export const NewTaskCollapsible = ({ parentId }: { parentId: string }) => {
	const [isOpen, setIsOpen] = useState<string | undefined>("");
	const { newTaskData, setNewTaskData } = useModalStore((state) => state);
	const { workspace, setWorkspace } = useWorkspaceStore((state) => state);
	const { user } = useUser();
	const { team } = useTeamStore((state) => state);
	const { tasks, subtasks, createTask, setSubtasks } = useTaskStore(
		(state) => state,
	);

	const { status, priority, dueDate, effortEstimate, labels } = newTaskData;

	const formSchema = z.object({
		description: z.string().optional(),
		title: z.string().min(2, {
			message: "Title must be at least 2 characters.",
		}),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		defaultValues: {
			description: "",
			title: "",
		},
		resolver: zodResolver(formSchema),
	});

	const { mutate: handleCreateTask, isPending } = useMutation({
		mutationFn: async (values: z.infer<typeof formSchema>) => {
			const { title, description } = values;
			if (tasks.some((task) => task.title === title))
				throw new Error(`${title} already exists`);
			if (!workspace) throw new Error("Workspace not found");
			if (!team) throw new Error("Team not found");
			if (!user) throw new Error("User not authenticated");

			const { transformedInput: transformedTitle } =
				transformingMentionInputs(title);

			const { transformedInput: transformedDescriptionInput } =
				transformingMentionInputs(description ?? "");

			const newTask = {
				description: transformedDescriptionInput,
				dueDate: dueDate ?? null,
				effortEstimate: effortEstimate ?? null,
				labels: labels || [],
				// updatedAt: new Date(), 		// do we need this for custom timestamp?
				parentId,
				priority: priority ?? "noPriority",
				status: status ?? "backlog",
				// dateCreated: new Date(),		// do we need this for custom timestamp?
				teamId: team.id,
				title: transformedTitle,
				workspaceId: workspace.externalId,
			};

			const res = await client.task.createTask
				.$post(newTask)
				.then((r) => r.json());
			res.task.order = subtasks.length + 1;
			createTask(res.task);
			setSubtasks([...subtasks, res.task]);
			setWorkspace({
				...workspace,
				tasksCreated: workspace.tasksCreated + 1,
			});
			return res;
		},
		mutationKey: ["task", "create"],
		onError: (error) => {
			toast.error("Error creating Task", {
				description: error.message,
			});
		},
		onSuccess({ task, url }) {
			toast.success("Task Created Successfully", {
				description: <Link href={url}>{task.title}</Link>,
			});
			setNewTaskData({});
			form.reset({ description: "", title: "" });
			setIsOpen("");
		},
	});

	const handleCancel = () => {
		setIsOpen("");
		form.reset({
			description: "",
			title: "",
		});
	};

	const onSubmit = (values: z.infer<typeof formSchema>) => {
		handleCreateTask(values);
	};

	return (
		<Accordion
			className="w-full"
			collapsible={true}
			onValueChange={setIsOpen}
			type="single"
			value={isOpen}
		>
			<AccordionItem value="subtask-collapsible">
				<AccordionTrigger className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-input bg-transparent px-3 hover:bg-accent hover:text-accent-foreground hover:no-underline">
					<CirclePlus className="mr-2 h-4 w-4" />
					Add Subtask
				</AccordionTrigger>
				<AccordionContent className="px-1">
					<Form {...form}>
						<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
							<div className="flex flex-col space-y-4">
								<FormField
									control={form.control}
									name="title"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-lg">Title</FormLabel>
											<FormControl>
												<Input
													{...field}
													className="text-md"
													placeholder="Title"
												/>
											</FormControl>
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="description"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-lg">Description</FormLabel>
											<FormControl>
												<Textarea
													{...field}
													className="resize-none text-md"
													placeholder="Add Description"
													rows={4}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
							<div className="grid grid-cols-3 gap-4 md:grid-cols-4 xl:grid-cols-5">
								<StatusDropdownButton />
								<LabelDropdownButton />
								<PriorityDropdownButton />
								<EffortDropdownButton />
								<DateDropdownButton />
							</div>
							<div className="mt-4 flex justify-end space-x-2">
								<Button
									className="bg-transparent hover:cursor-pointer"
									onClick={handleCancel}
									type="button"
									variant="outline"
								>
									Cancel
								</Button>
								<Button
									className="hover:cursor-pointer"
									disabled={isPending}
									type="submit"
								>
									{isPending ? "Creating..." : "Create Task"}
								</Button>
							</div>
						</form>
					</Form>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
};
