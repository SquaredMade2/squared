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
	useAuthStore,
	useModalStore,
	useTaskStore,
	useTeamStore,
	useWorkspaceStore,
} from "@/store";
import { transformingMentionInputs } from "@/utils/transformingMentionInputs";
import { zodResolver } from "@hookform/resolvers/zod";
import { AccordionTrigger } from "@repo/ui/accordion";
import { TODO } from "@squared/context";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DateDropdownButton } from "./DateDropdownButton";
import { EffortDropdownButton } from "./EffortDropdownButton";
import { LabelDropdownButton } from "./LabelDropdownButton";
import { PriorityDropdownButton } from "./PriorityDropdownButton";
import { StatusDropdownButton } from "./StatusDropdownButton";

export const NewIssueCollapsible = ({ parentId }: { parentId: string }) => {
	const [isOpen, setIsOpen] = useState<string | undefined>("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();
	const { newIssueData, setNewIssueData } = useModalStore((state) => state);
	const { user } = useAuthStore((state) => state);
	const { currentTeam } = useTeamStore((state) => state);
	const { currentWorkspace, updateWorkspace, setCurrentWorkspace } =
		useWorkspaceStore((state) => state);
	const { tasks } = useTaskStore((state) => state);

	const { status, priority, dueDate, effortEstimate, labels } = newIssueData;

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

	const handleCreateIssue = async (values: z.infer<typeof formSchema>) => {
		const { title, description } = values;
		setIsSubmitting(true);

		if (tasks.some((task) => task.title === title)) {
			toast({
				title: `${title} already exists`,
				variant: "destructive",
			});
			return;
		}
		if (!currentWorkspace || !currentTeam || !user) {
			toast({
				title: "Error authenticating user",
				variant: "destructive",
			});
			return;
		}
		await updateWorkspace(currentWorkspace?.id, {
			tasksCreated: (currentWorkspace.tasksCreated ?? 0) + 1,
		});
		try {
			const { transformedInput: transformedTitle } =
				transformingMentionInputs(title);

			const { transformedInput: transformedDescriptionInput } =
				transformingMentionInputs(description ?? "");

			const newTask = {
				authorId: user.id,
				title: transformedTitle,
				description: transformedDescriptionInput,
				identifier: `${currentTeam.identifier}-${currentWorkspace.tasksCreated + 1}`,
				status: status ?? "backlog",
				priority: priority ?? "noPriority",
				labels: labels || [],
				dueDate: dueDate ?? null,
				effortEstimate: effortEstimate,
				dateCreated: new Date(),
				teamId: currentTeam.id,
				workspaceId: currentWorkspace.id,
				updatedAt: new Date(),
				parentId: parentId,
			};
			await taskService.createTask(TODO, newTask);
			await updateWorkspace(currentWorkspace.id, {
				tasksCreated: currentWorkspace.tasksCreated + 1,
			});
			setCurrentWorkspace({
				...currentWorkspace,
				tasksCreated: currentWorkspace.tasksCreated + 1,
			});

			toast({
				title: "Task created successfully",
			});

			setIsOpen("");
			setNewIssueData({});
			form.reset({
				title: "",
				description: "",
			});
			toast({
				title: "New Issue Created",
			});
		} catch (error) {
			toast({
				title: "Error creating issue",
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
			<AccordionItem value="subissue-collapsible">
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
							onSubmit={form.handleSubmit(handleCreateIssue)}
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
									{isSubmitting ? "Creating..." : "Create Issue"}{" "}
								</Button>
							</div>
						</form>
					</Form>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
};
