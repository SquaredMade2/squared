"use client";

import { useCreateTask } from "@/hooks/useCreateTask";
import { useModalStore, useTeamStore, useWorkspaceStore } from "@/store";
import { parseError } from "@/utils/parseError";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@squaredmade/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@squaredmade/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@squaredmade/ui/form";
import { useToast } from "@squaredmade/ui/hooks";
import { Input } from "@squaredmade/ui/input";
import { Separator } from "@squaredmade/ui/separator";
import { Textarea } from "@squaredmade/ui/textarea";
import { ChevronRight, LayoutGrid } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DateDropdownButton } from "./DateDropdownButton";
import { EffortDropdownButton } from "./EffortDropdownButton";
import { LabelDropdownButton } from "./LabelDropdownButton";
import { PriorityDropdownButton } from "./PriorityDropdownButton";
import { StatusDropdownButton } from "./StatusDropdownButton";
export * from "./NewTaskButton";
export * from "./NewTaskCollapsible";

const formSchema = z.object({
	title: z.string().min(2, {
		message: "Title must be at least 2 characters.",
	}),
	description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const NewTaskModal = () => {
	const { toast } = useToast();
	const { showNewTask, newTaskData, setNewTaskData, setShowNewTask } =
		useModalStore((state) => state);
	const { createTask, isLoading } = useCreateTask();
	const { team } = useTeamStore((state) => state);
	const { workspace } = useWorkspaceStore((state) => state);

	const {
		status,
		priority,
		dueDate,
		effortEstimate,
		labels,
		title,
		description,
		sprintId,
	} = newTaskData;

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			description: "",
		},
	});

	useEffect(() => {
		if (title) form.setValue("title", title);
		if (description) form.setValue("description", description);
	}, [showNewTask, title, description, form]);

	const handleDiscard = () => {
		setNewTaskData({});
		form.reset();
		setShowNewTask(false);
	};

	const handleCreateTask = (values: FormValues) => {
		if (!team || !workspace) {
			toast({
				title: "Error",
				description: "Team or workspace not found",
				variant: "destructive",
			});
			return;
		}

		const createTaskParams = {
			title: values.title,
			description: values.description,
			status: status || "backlog",
			priority: priority || "noPriority",
			labels: labels || [],
			dueDate: dueDate || null,
			effortEstimate: effortEstimate || null,
			teamId: team.id,
			workspaceId: workspace.id,
			sprintId,
		};

		createTask(createTaskParams, {
			onSuccess: () => {
				toast({
					title: "Task Created Successfully",
				});
				setShowNewTask(false);
				setNewTaskData({});
				form.reset();
			},
			onError: (error) => {
				toast({
					title: "Error creating task",
					description: parseError(error),
					variant: "destructive",
				});
			},
		});
	};

	return (
		<Dialog open={showNewTask} onOpenChange={setShowNewTask}>
			<DialogContent className="max-w-full bg-popover">
				<DialogHeader>
					<div className="flex items-center">
						<div className="inline-flex items-center justify-center text-muted-foreground border border-border rounded-md shadow-md px-2 py-0.5 mr-2">
							<LayoutGrid className="text-[#9577FF] w-4 h-4" />
						</div>
						<ChevronRight />
						<DialogTitle className="text-sm">New Task</DialogTitle>
					</div>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleCreateTask)}>
						<div className="flex space-x-4 ">
							<div className="w-4/5 space-y-4 ">
								<FormField
									control={form.control}
									name="title"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-xl">Title</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder="Title"
													className="text-md"
													tabIndex={0}
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
											<FormLabel className="text-xl">Description</FormLabel>
											<FormControl>
												<Textarea
													{...field}
													placeholder="Add Description"
													className="text-md resize-none"
													rows={4}
													tabIndex={0}
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
								className="hover:cursor-pointer bg-transparent text-foreground"
								variant="destructive"
								type="button"
							>
								Discard
							</Button>
							<Button
								type="submit"
								className="hover:cursor-pointer"
								disabled={isLoading}
							>
								{isLoading ? "Creating..." : "Create Task"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
