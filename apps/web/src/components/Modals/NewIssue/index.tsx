import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogFooter,
	DialogHeader,
} from "@/components/ui/dialog";
import { StatusDropdownButton } from "./StatusDropdownButton";
import { EffortDropdownButton } from "./EffortDropdownButton";
import { LabelDropdownButton } from "./LabelDropdownButton";
import { useToast } from "@/components/ui/use-toast";
import { PriorityDropdownButton } from "./PriorityDropdownButton";
import { Separator } from "@/components/ui/separator";
import {
	Form,
	FormItem,
	FormControl,
	FormField,
	FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LayoutGrid, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { transformingMentionInputs } from "@/utils/transformingMentionInputs";
import {
	useAuthStore,
	useModalStore,
	useTaskStore,
	useTeamStore,
	useWorkspaceStore,
} from "@/store";
import type { Task } from "@repo/db";
import { DateDropdownButton } from "./DateDropdownButton";
export * from "./NewIssueButton";
export * from "./NewIssueCollapsible";

export const NewIssueModal = () => {
	const { toast } = useToast();
	const { showNewIssue, newIssueData, setNewIssueData, setShowNewIssue } =
		useModalStore((state) => state);
	const { user } = useAuthStore((state) => state);
	const { currentTeam } = useTeamStore((state) => state);
	const { currentWorkspace, updateWorkspace, setCurrentWorkspace } =
		useWorkspaceStore((state) => state);
	const { tasks, addTask } = useTaskStore((state) => state);

	const { status, priority, dueDate, effortEstimate, labels } = newIssueData;

	const handleDiscard = () => {
		setNewIssueData({});

		form.reset({
			title: "",
			description: "",
		});

		setShowNewIssue(false);
	};

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

			const newTask: Task = {
				authorId: user.id,
				title: transformedTitle,
				description: transformedDescriptionInput,
				identifier: `${currentTeam.identifier}-${currentWorkspace.tasksCreated + 1}`,
				status: status ?? "backlog",
				priority: priority ?? "noPriority",
				labels: labels || [],
				dueDate: dueDate ?? null,
				effortEstimate: effortEstimate ?? null,
				dateCreated: new Date(),
				assigneeId: null,
				assigneeName: "",
				teamId: currentTeam.id,
				id: "",
				workspaceId: currentWorkspace.id,
				updatedAt: new Date(),
				deleted: false,
				parentId: null,
			};

			const {
				task: taskCreatedResponse,
				message,
				variant,
			} = await addTask(newTask);
			await updateWorkspace(currentWorkspace.id, {
				tasksCreated: currentWorkspace.tasksCreated + 1,
			});
			setCurrentWorkspace({
				...currentWorkspace,
				tasksCreated: currentWorkspace.tasksCreated + 1,
			});

			toast({
				title: message,
				variant: variant,
			});
			if (!taskCreatedResponse) return;
			setShowNewIssue(false);
			setNewIssueData({});
			form.reset({
				title: "",
				description: "",
			});
			toast({
				title: "New Issue Created",
				variant: variant,
			});
		} catch (_err) {
			toast({
				title: "Error creating issue",
				variant: "destructive",
			});
		}
	};

	return (
		<Dialog open={showNewIssue} onOpenChange={setShowNewIssue}>
			<DialogContent className="max-w-full bg-popover">
				<DialogHeader>
					<div className="flex items-center">
						<div className="inline-flex items-center justify-center text-muted-foreground border border-border rounded-md shadow-md px-2 py-0.5 mr-2">
							<LayoutGrid className="text-[#9577FF] w-4 h-4" />
						</div>
						<ChevronRight />
						<DialogTitle className="text-sm">New Issue</DialogTitle>
					</div>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleCreateIssue)}>
						<div className="flex space-x-4 ">
							<div className="w-4/5 space-y-4 ">
								<FormField
									control={form.control}
									name="title"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-2xl">Title</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder="Title"
													className="text-lg"
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
											<FormLabel className="text-2xl">Description</FormLabel>
											<FormControl>
												<Textarea
													{...field}
													placeholder="Add Description"
													className="text-lg resize-none"
													rows={4}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
							<div>
								<Separator orientation="vertical" />
							</div>
							<div className="w-1/5 space-y-4">
								<StatusDropdownButton />
								<LabelDropdownButton />
								<PriorityDropdownButton />
								<EffortDropdownButton />
								<DateDropdownButton />
							</div>
						</div>
						<DialogFooter className="mt-6">
							<Button
								onClick={handleDiscard}
								className="hover:cursor-pointer bg-transparent"
								variant="destructive"
								type="button"
							>
								Discard
							</Button>
							<Button type="submit" className="hover:cursor-pointer">
								Create Issue
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default NewIssueModal;
