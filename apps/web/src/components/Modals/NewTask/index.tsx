"use client";

import TextEditor, {
	initialEditorValue,
	type CustomDescendant,
	type CustomElement,
} from "@/components/TextEditor";
import { useCreateTask } from "@/hooks/useCreateTask";
import { useSprints } from "@/hooks/useSprints";
import { client } from "@/lib/client";
import { useModalStore, useTeamStore } from "@/store";
import { convertSlateToMDX } from "@/utils/formatting";
import { parseError } from "@/utils/parseError";
import { useOrganization } from "@clerk/nextjs";
import { ChevronRight } from "@squaredmade/icons";
import { Button } from "@squaredmade/ui/button";
import { Checkbox } from "@squaredmade/ui/checkbox";
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
import { toast } from "@squaredmade/ui/toast";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { z } from "zod";
import { DateDropdownButton } from "./DateDropdownButton";
import { EffortDropdownButton } from "./EffortDropdownButton";
import { LabelDropdownButton } from "./LabelDropdownButton";
import { PriorityDropdownButton } from "./PriorityDropdownButton";
import { SprintDropdownButton } from "./SprintDropdownButton";
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
		.max(50, { message: "Title must be 50 characters or less." }),
	description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const NewTaskModal = () => {
	const { activeSprint, upcomingSprints } = useSprints();
	const { showNewTask, newTaskData, setNewTaskData, setShowNewTask } =
		useModalStore((state) => state);
	const { createTask, isLoading } = useCreateTask();
	const { team, setTeams, setTeam } = useTeamStore((state) => state);
	const { organization } = useOrganization();
	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const [editorDescription, setEditorDescription] =
		useState<CustomDescendant[]>(initialEditorValue);

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
			description: convertSlateToMDX(editorDescription as CustomElement[]),
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
			<DialogContent tabIndex={undefined} className="md:max-w-4xl">
				<DialogHeader>
					<div className="flex items-center">
						<TeamSelector />
						<ChevronRight />
						<DialogTitle className="text-sm">New Task</DialogTitle>
					</div>
				</DialogHeader>
				<Form {...form} onSubmit={handleCreateTask}>
					<div className="flex space-x-4">
						<div className="w-4/5">
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-xl">Title</FormLabel>
										<FormControl>
											<Input
												{...field}
												autoFocus
												placeholder="Title"
												className="text-md"
												onFocus={() => setIsEditingTitle(true)}
												onBlur={() => setIsEditingTitle(false)}
												maxLength={50}
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
											<div className="markdown-content">
												<TextEditor
													{...field}
													placeholder="Add Description"
													value={editorDescription}
													setValue={setEditorDescription}
												/>
											</div>
										</FormControl>
									</FormItem>
								)}
							/>
							{upcomingSprints.length === 0 && activeSprint && (
								<div className="mt-4 flex items-center gap-2">
									<Checkbox
										checked={activeSprint.id === newTaskData.sprintId}
										onCheckedChange={(checked) =>
											setNewTaskData({
												...newTaskData,
												sprintId: checked ? activeSprint.id : null,
											})
										}
									/>
									<p className="text-foreground">Add task to current sprint</p>
								</div>
							)}
						</div>
						<div>
							<Separator orientation="vertical" />
						</div>
						<div className="w-1/5 space-y-4">
							<StatusDropdownButton />
							<LabelDropdownButton />
							<PriorityDropdownButton />
							<EffortDropdownButton />
							{upcomingSprints.length > 0 && (
								<SprintDropdownButton
									activeSprint={activeSprint || null}
									upcomingSprints={upcomingSprints}
								/>
							)}
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
