"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useCreateTask } from "@/hooks/useCreateTask";
import { client } from "@/lib/client";
import { useModalStore, useTeamStore } from "@/store";
import { parseError } from "@/utils/parseError";
import { useOrganization } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
	const { team, setTeams, setTeam } = useTeamStore((state) => state);
	const { organization } = useOrganization();

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
		if (!team || !organization) {
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
			workspaceId: organization.id,
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

	useQuery({
		queryKey: ["teams", organization?.id],
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
			<DialogContent className="max-w-full bg-popover">
				<DialogHeader>
					<div className="flex items-center">
						<TeamSelector />
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
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
