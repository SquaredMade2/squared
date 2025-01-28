import {
	Accordion,
	AccordionContent,
	AccordionItem,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { taskService } from "@/lib/services";
import {
	useModalStore,
	useTaskStore,
	useTeamStore,
	useWorkspaceStore,
} from "@/store";
import { transformingMentionInputs } from "@/utils/transformingMentionInputs";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { TODO } from "@squared/context";
import { AccordionTrigger } from "@squaredmade/ui/accordion";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DateDropdownButton } from "./DateDropdownButton";
import { EffortDropdownButton } from "./EffortDropdownButton";
import { LabelDropdownButton } from "./LabelDropdownButton";
import { PriorityDropdownButton } from "./PriorityDropdownButton";
import { StatusDropdownButton } from "./StatusDropdownButton";

export const NewTaskCollapsible = ({ parentId }: { parentId: string }) => {
	const [isOpen, setIsOpen] = useState<string | undefined>("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();
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

	const handleCreateTask = async (values: z.infer<typeof formSchema>) => {
		const { title, description } = values;
		setIsSubmitting(true);

		if (tasks.some((task) => task.title === title)) {
			toast({
				title: `${title} already exists`,
				variant: "destructive",
			});
			return;
		}

		if (!workspace) {
			toast({
				title: "Workspace not found",
				variant: "destructive",
			});
			return;
		}

		if (!team) {
			toast({
				title: "Team not found",
				variant: "destructive",
			});
			return;
		}

		if (!user) {
			toast({
				title: "User not authenticated",
				variant: "destructive",
			});
			return;
		}
		try {
			const { transformedInput: transformedTitle } =
				transformingMentionInputs(title);

			const { transformedInput: transformedDescriptionInput } =
				transformingMentionInputs(description ?? "");

			const newTask = {
				authorId: user.id,
				title: transformedTitle,
				description: transformedDescriptionInput,
				identifier: `${team.identifier}-${workspace.tasksCreated + 1}`,
				status: status ?? "backlog",
				priority: priority ?? "noPriority",
				labels: labels || [],
				dueDate: dueDate ?? null,
				effortEstimate: effortEstimate ?? null,
				dateCreated: new Date(),
				teamId: team.id,
				workspaceId: workspace.id,
				updatedAt: new Date(),
				parentId: parentId,
			};
			const createdTask = await taskService.createTask(TODO, newTask);
			createdTask.order = subtasks.length + 1;
			createTask(createdTask);
			setSubtasks([...subtasks, createdTask]);
			setWorkspace({
				...workspace,
				tasksCreated: workspace.tasksCreated + 1,
			});

			toast({
				title: "Task created successfully",
			});

			setIsOpen("");
			setNewTaskData({});
			form.reset({
				title: "",
				description: "",
			});
			toast({
				title: "New Task Created",
			});
		} catch (error) {
			toast({
				title: "Error creating Task",
				description: error instanceof Error ? error.message : "Unknown error",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

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
				<AccordionTrigger asChild>
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="my-4 flex items-center w-full"
					>
						<PlusCircle className="w-4 h-4 mr-2" />
						Add Subtask
					</Button>
				</AccordionTrigger>
				<AccordionContent className="px-1">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleCreateTask)}
							className="space-y-4"
						>
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
													className="text-md resize-none"
													rows={4}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
							<div className="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
								<StatusDropdownButton />
								<LabelDropdownButton />
								<PriorityDropdownButton />
								<EffortDropdownButton />
								<DateDropdownButton />
							</div>
							<div className="flex justify-end space-x-2 mt-4">
								<Button
									onClick={handleCancel}
									className="hover:cursor-pointer bg-transparent"
									variant="outline"
									type="button"
								>
									Cancel
								</Button>
								<Button type="submit" className="hover:cursor-pointer">
									{isSubmitting ? "Creating..." : "Create Task"}{" "}
								</Button>
							</div>
						</form>
					</Form>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
};
