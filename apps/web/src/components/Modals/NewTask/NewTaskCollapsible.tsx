import { client } from "@/lib/client";
import {
	useModalStore,
	useTaskStore,
	useTeamStore,
	useWorkspaceStore,
} from "@/store";
import { formatUrl } from "@/utils/formatting";
import { transformingMentionInputs } from "@/utils/transformingMentionInputs";
import { useUser } from "@clerk/nextjs";
import { CirclePlus } from "@squaredmade/icons";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
} from "@squaredmade/ui/accordion";
import { AccordionTrigger } from "@squaredmade/ui/accordion";
import { Button } from "@squaredmade/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	useForm,
} from "@squaredmade/ui/form";
import { zodResolver } from "@squaredmade/ui/form/resolvers";
import { Input } from "@squaredmade/ui/input";
import { Textarea } from "@squaredmade/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { DateDropdownButton } from "./DateDropdownButton";
import { EffortDropdownButton } from "./EffortDropdownButton";
import { LabelDropdownButton } from "./LabelDropdownButton";
import { PriorityDropdownButton } from "./PriorityDropdownButton";
import { StatusDropdownButton } from "./StatusDropdownButton";

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
		title: z.string().min(2, {
			message: "Title must be at least 2 characters.",
		}),
		description: z.string().optional(),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			description: "",
		},
	});

	const { mutate: handleCreateTask, isPending } = useMutation({
		mutationKey: ["task", "create"],
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
				title: transformedTitle,
				description: transformedDescriptionInput,
				status: status ?? "backlog",
				priority: priority ?? "noPriority",
				labels: labels || [],
				dueDate: dueDate ?? null,
				effortEstimate: effortEstimate ?? null,
				// dateCreated: new Date(),		// do we need this for custom timestamp?
				teamId: team.id,
				workspaceId: workspace.externalId,
				// updatedAt: new Date(), 		// do we need this for custom timestamp?
				parentId: parentId,
			};

			const createdTask = await client.task.createTask
				.$post(newTask)
				.then((res) => res.json());
			createdTask.order = subtasks.length + 1;
			createTask(createdTask);
			setSubtasks([...subtasks, createdTask]);
			setWorkspace({
				...workspace,
				tasksCreated: workspace.tasksCreated + 1,
			});
			return createdTask;
		},
		onSuccess(data) {
			toast.success("Task Created Successfully", {
				description: (
					<Link
						href={`/${workspace?.url}/task/${data.identifier}/${formatUrl(data.title)}`}
					>
						{data.title}
					</Link>
				),
			});
			setNewTaskData({});
			form.reset({ title: "", description: "" });
			setIsOpen("");
		},
		onError: (error) => {
			toast.error("Error creating Task", {
				description: error.message,
			});
		},
	});

	const handleCancel = () => {
		setIsOpen("");
		form.reset({
			title: "",
			description: "",
		});
	};

	return (
		<Accordion
			type="single"
			collapsible
			className="w-full"
			value={isOpen}
			onValueChange={setIsOpen}
		>
			<AccordionItem value="subtask-collapsible">
				<AccordionTrigger className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-input bg-transparent px-3 hover:bg-accent hover:text-accent-foreground hover:no-underline">
					<CirclePlus className="mr-2 h-4 w-4" />
					Add Subtask
				</AccordionTrigger>
				<AccordionContent className="px-1">
					<Form {...form} onSubmit={handleCreateTask} className="space-y-4">
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
												placeholder="Title"
												className="text-md"
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
												placeholder="Add Description"
												className="resize-none text-md"
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
								onClick={handleCancel}
								className="bg-transparent hover:cursor-pointer"
								variant="outline"
								type="button"
							>
								Cancel
							</Button>
							<Button
								type="submit"
								className="hover:cursor-pointer"
								disabled={isPending}
							>
								{isPending ? "Creating..." : "Create Task"}
							</Button>
						</div>
					</Form>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
};
