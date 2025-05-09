"use client";

import { useCreateTask } from "@/hooks/useCreateTask";
import { client } from "@/lib/client";
import { useModalStore, useTeamStore } from "@/store";
import { parseError } from "@/utils/parseError";
import { useOrganization } from "@clerk/nextjs";
import { ChevronRight } from "@squaredmade/icons";
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
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	useForm,
} from "@squaredmade/ui/form";
import { zodResolver } from "@squaredmade/ui/form/resolvers";
import { Input } from "@squaredmade/ui/input";
import { Separator } from "@squaredmade/ui/separator";
import { Textarea } from "@squaredmade/ui/textarea";
import { toast } from "@squaredmade/ui/toast";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { z } from "zod";
import { DateDropdownButton } from "./DateDropdownButton";
import { EffortDropdownButton } from "./EffortDropdownButton";
import { LabelDropdownButton } from "./LabelDropdownButton";
import { PriorityDropdownButton } from "./PriorityDropdownButton";
import { StatusDropdownButton } from "./StatusDropdownButton";
import TeamSelector from "./TeamSelector";
export * from "./NewTaskButton";
export * from "./NewTaskCollapsible";

const formSchema = z.object({
	title: z
		.string()
		.min(2, {
			message: "Title must be at least 2 characters.",
		})
		.max(51, { message: "Title must be less than 50 characters." }),
	description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const NewTaskModal = () => {
	const { showNewTask, newTaskData, setNewTaskData, setShowNewTask } =
		useModalStore((state) => state);
	const { createTask, isLoading } = useCreateTask();
	const { team, setTeams, setTeam } = useTeamStore((state) => state);
	const { organization } = useOrganization();
	const [isEditingTitle, setIsEditingTitle] = useState(false);

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

	const titleValue = form.watch("title");

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
		if (!team || !organization) {
			toast.error("Error", {
				description: "Team or workspace not found",
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
			workspaceId: organization.id,
			sprintId,
		};

		createTask(createTaskParams, {
			onSuccess: () => {
				toast.success("Task Created Successfully");
				setShowNewTask(false);
				setNewTaskData({});
				form.reset();
			},
			onError: (error) => {
				toast.error("Error creating task", {
					description: parseError(error),
				});
			},
		});
	};

	useQuery({
		queryKey: ["team", "getUserTeams", organization?.id],
		queryFn: async () => {
			if (!organization) return [];
			const teams = await client.team.getUserTeams
				.$get({
					workspaceId: organization.id,
				})
				.then((res) => res.json());
			setTeams(teams);
			setTeam(teams[0]);
			return teams;
		},
		enabled: !team,
	});

	return (
		<Dialog open={showNewTask} onOpenChange={setShowNewTask}>
			<DialogContent className="md:max-w-4xl">
				<DialogHeader>
					<div className="flex items-center">
						<TeamSelector />
						<ChevronRight />
						<DialogTitle className="text-sm">New Task</DialogTitle>
					</div>
				</DialogHeader>
				<Form {...form} onSubmit={handleCreateTask}>
					<div className="flex space-x-4">
						<div className="w-4/5 space-y-4">
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
												onFocus={() => setIsEditingTitle(true)}
												onBlur={() => setIsEditingTitle(false)}
												maxLength={50}
												tabIndex={0}
											/>
										</FormControl>
										<FormDescription
											className={`text-end text-muted-foreground text-xs opacity-0 transition-opacity duration-200 ${isEditingTitle && "opacity-100"}`}
										>
											{titleValue?.length ?? 0} / 50
										</FormDescription>
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
												className="resize-none text-md"
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
							className="bg-transparent text-foreground hover:cursor-pointer"
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
				</Form>
			</DialogContent>
		</Dialog>
	);
};
