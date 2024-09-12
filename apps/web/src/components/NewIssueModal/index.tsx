import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogFooter,
	DialogHeader,
} from "../ui/dialog";
import PriorityButton from "@/components/PriorityButton";
import { StatusDropdownButton } from "@/components/StatusDropdownButton";
import DateButton from "@/components/DateButton";
import EffortEstimateButton from "@/components/EffortEstimateButton";
import LabelDropdownButton from "../LabelDropdownButton";
import { useToast } from "../ui/use-toast";
import DesignationsContainer from "@/components/DesignationsContainer";

import { Separator } from "../ui/separator";
import {
	Form,
	FormItem,
	FormDescription,
	FormControl,
	FormField,
	FormLabel,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

import { LayoutGrid, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { transformingMentionInputs } from "@/utils/transformingMentionInputs";
import MentionInput from "@/components/MentionsInput";
import { SocketContext } from "@/app/SocketProvider";
import type { OnChangeHandlerFunc } from "react-mentions";
import {
	useAuthStore,
	useModalStore,
	useTaskStore,
	useTeamStore,
	useUserStore,
	useWorkspaceStore,
} from "@/storeZ";
import type { Task } from "@repo/db";

const NewIssueModal = () => {
	const { toast } = useToast();
	const { showNewIssue, newIssueData, setNewIssueData, setShowNewIssue } =
		useModalStore((state) => state);
	const { user } = useAuthStore((state) => state);
	const { currentTeam } = useTeamStore((state) => state);
	const { currentWorkspace, updateWorkspace } = useWorkspaceStore(
		(state) => state,
	);
	const { users } = useUserStore((state) => state);
	const { tasks, addTask } = useTaskStore((state) => state);

	const authorId = user?.id;
	const { status, priority, dueDate, effortEstimate, labels } = newIssueData;

	// const [titleInput, setTitleInput] = useState("");
	// const [descriptionInput, setDescriptionInput] = useState("");

	const socket = useContext(SocketContext);

	// const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
	// 	setTitleInput(e.target.value);
	// };

	// const handleDescriptionChange: OnChangeHandlerFunc = (e) => {
	// 	setDescriptionInput(e.target.value);
	// };

	const handleDiscard = () => {
		setNewIssueData({});
	};

	const formSchema = z.object({
		title: z.string().min(2, {
			message: "Username must be at least 2 characters.",
		}),
		description: z.string().min(2, {
			message: "Username must be at least 2 characters.",
		}),
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
		console.log("Title submitted:", title);
		// if (titleInput.replace(/\s+/g, "").length === 0) {
		// 	toast({
		// 		title: "Please Enter a Title!",
		// 		variant: "destructive",
		// 	});
		// 	return;
		// }
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
		updateWorkspace(currentWorkspace?.id, {
			issuesCreated: (currentWorkspace.issuesCreated ?? 0) + 1,
		});
		try {
			const { transformedInput: transformedTitle, userIds: titleUserId } =
				transformingMentionInputs(title);

			const {
				transformedInput: transformedDescriptionInput,
				userIds: descriptionUserId,
			} = transformingMentionInputs(description);

			const mentionedUserId = new Set([...descriptionUserId, ...titleUserId]);
			const newTask: Task = {
				authorId: user.id,
				title: transformedTitle,
				description: transformedDescriptionInput,
				identifier: `${currentTeam.identifier}-${currentWorkspace.issuesCreated}`,
				status: status ?? "todo",
				priority: priority ?? "noPriority",
				labels: labels || [],
				dueDate: dueDate ?? null,
				effortEstimate: effortEstimate ?? null,
				dateCreated: new Date(),
				assigneeId: null,
				assigneeName: "",
				teamId: currentTeam.id,
				id: "",
			};
			console.log(newTask);
			const {
				task: taskCreatedResponse,
				message,
				variant,
			} = await addTask(newTask);

			toast({
				title: message,
				variant: variant,
			});
			if (!taskCreatedResponse) return;

			socket.emit(
				"user_mentioned",
				[...mentionedUserId],
				taskCreatedResponse.id,
				user.id,
			);
			setShowNewIssue(false);
			setNewIssueData({});
		} catch (err) {
			console.log(err);
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
					<form
						onSubmit={form.handleSubmit(handleCreateIssue)}
						className="flex space-x-4"
					>
						<div className="w-3/4 space-y-4">
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
												className="text-lg"
												rows={4}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
						<Separator orientation="vertical" />
						<div className="w-1/4 space-y-4">
							<Button>TEST BTN</Button>
							<Button>TEST BTN</Button>
							<Button>TEST BTN</Button>
							<Button>TEST BTN</Button>
							<DialogFooter>
								<Button
									onClick={handleDiscard}
									className="hover:cursor-pointer bg-transparent"
									variant="destructive"
								>
									Discard
								</Button>
								<Button type="submit" className="hover:cursor-pointer">
									Create Issue
								</Button>
							</DialogFooter>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default NewIssueModal;
