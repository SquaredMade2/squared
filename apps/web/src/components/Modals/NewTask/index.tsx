"use client";

import { useOrganization } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
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
} from "@squaredmade/ui/form";
import { Input } from "@squaredmade/ui/input";
import { Separator } from "@squaredmade/ui/separator";
import { toast } from "@squaredmade/ui/toast";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import TextEditor, {
	type CustomDescendant,
	type CustomElement,
	initialEditorValue,
} from "@/components/TextEditor";
import { convertSlateToMDX } from "@/components/TextEditor/format";
import { useCreateTask } from "@/hooks/useCreateTask";
import { useSprints } from "@/hooks/useSprints";
import { client } from "@/lib/client";
import { useModalStore, useTeamStore } from "@/store";
import { parseError } from "@/utils/parseError";
import { DateDropdownButton } from "./DateDropdownButton";
import { EffortDropdownButton } from "./EffortDropdownButton";
import { LabelDropdownButton } from "./LabelDropdownButton";
import { PriorityDropdownButton } from "./PriorityDropdownButton";
import { SprintDropdownButton } from "./SprintDropdownButton";
import { StatusDropdownButton } from "./StatusDropdownButton";
import TeamSelector from "./TeamSelector";

export {
	GridColumnNewTaskButton,
	NewTaskButton,
	NoTasksNewTaskButton,
} from "./NewTaskButton";
export { NewTaskCollapsible } from "./NewTaskCollapsible";

const formSchema = z.object({
	description: z.string().optional(),
	title: z
		.string()
		.min(2, {
			message: "Title must be at least 2 characters.",
		})
		.max(50, { message: "Title must be 50 characters or less." }),
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
		defaultValues: {
			description: "",
			title: "",
		},
		resolver: zodResolver(formSchema),
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
		if (!(team && organization)) {
			toast.error("Error", {
				description: "Team or workspace not found",
			});
			return;
		}

		const createTaskParams = {
			description:
				convertSlateToMDX(editorDescription as CustomElement[]) || "",
			dueDate: dueDate || null,
			effortEstimate: effortEstimate || null,
			labels: labels || [],
			priority: priority || "noPriority",
			sprintId,
			status: status || "backlog",
			teamId: team.id,
			title: values.title,
			workspaceId: organization.id,
		};

		createTask(createTaskParams, {
			onError: (error) => {
				toast.error("Error creating task", {
					description: parseError(error),
				});
			},
			onSuccess: ({ url }) => {
				toast.success("Task Created Successfully", {
					description: (
						<Link href={url} passHref={true}>
							<Button className="m-0 p-0" variant="link">
								Go to task
							</Button>
						</Link>
					),
				});
				setShowNewTask(false);
				setNewTaskData({});
				setEditorDescription(initialEditorValue);
				form.reset();
			},
		});
	};

	useQuery({
		enabled: !team,
		queryFn: async () => {
			if (!organization) return [];
			const teams = await client.team.getUserTeams
				.$get()
				.then((res) => res.json());
			setTeams(teams);
			setTeam(teams[0]);
			return teams;
		},
		queryKey: ["team", "getUserTeams", organization?.id],
	});

	return (
		<Dialog onOpenChange={setShowNewTask} open={showNewTask}>
			<DialogContent className="md:max-w-4xl" tabIndex={undefined}>
				<DialogHeader>
					<div className="flex items-center">
						<TeamSelector />
						<ChevronRight />
						<DialogTitle className="text-sm">New Task</DialogTitle>
					</div>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleCreateTask)}>
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
													autoFocus={true}
													className="text-md"
													maxLength={50}
													onBlur={() => setIsEditingTitle(false)}
													onFocus={() => setIsEditingTitle(true)}
													placeholder="Title"
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
									render={() => (
										<FormItem>
											<FormLabel className="text-xl">Description</FormLabel>
											<FormControl>
												<TextEditor
													hasToolbar={false}
													onChange={setEditorDescription}
													placeholder="Add Description"
													value={editorDescription}
												/>
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
										<p className="text-foreground">
											Add task to current sprint
										</p>
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
								className="bg-transparent text-foreground hover:cursor-pointer"
								onClick={handleDiscard}
								type="button"
								variant="destructive"
							>
								Discard
							</Button>
							<Button
								className="hover:cursor-pointer"
								disabled={isLoading}
								type="submit"
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
