import { useState, useEffect, useContext } from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogFooter,
	DialogHeader,
} from "../ui/dialog";
import { useSelector } from "react-redux";
import { useToast } from "../ui/use-toast";
import DesignationsContainer from "@/components/DesignationsContainer";
import { LayoutGrid, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { transformingMentionInputs } from "@/utils/transformingMentionInputs";
import MentionInput from "@/components/MentionsInput";
import { SocketContext } from "@/app/SocketProvider";
import type { Task, User } from "@repo/db";
import type { OnChangeHandlerFunc } from "react-mentions";
import {
	useAuthStore,
	useModalStore,
	useTaskStore,
	useTeamStore,
	useUserStore,
	useWorkspaceStore,
} from "@/storeZ";

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
	const { status, priority, labels, dueDate, effortEstimate } = newIssueData;

	const [titleInput, setTitleInput] = useState("");
	const [descriptionInput, setDescriptionInput] = useState("");

	const socket = useContext(SocketContext);

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTitleInput(e.target.value);
	};

	const handleDescriptionChange: OnChangeHandlerFunc = (e) => {
		setDescriptionInput(e.target.value);
	};

	const handleDiscard = () => {
		setNewIssueData({});
	};

	const handleCreateIssue = async () => {
		if (titleInput.replace(/\s+/g, "").length === 0) {
			toast({
				title: "Please Enter a Title!",
				variant: "destructive",
			});
			return;
		}
		if (tasks.some((task) => task.title === titleInput)) {
			toast({
				title: `${titleInput} already exists`,
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
				transformingMentionInputs(titleInput);
			const {
				transformedInput: transformedDescriptionInput,
				userIds: descriptionUserId,
			} = transformingMentionInputs(descriptionInput);
			const mentionedUserId = new Set([...descriptionUserId, ...titleUserId]);
			const newTask: Task = {
				authorId: user.id,
				title: transformedTitle,
				description: transformedDescriptionInput,
				identifier: `${currentTeam.identifier}-${currentWorkspace.issuesCreated}`,
				status: status ?? "todo",
				priority: priority ?? "noPriority",
				labels: labels ?? [],
				dueDate: dueDate ?? null,
				effortEstimate: effortEstimate ?? null,
				dateCreated: new Date(),
				assigneeId: null,
				assigneeName: "",
				teamId: currentTeam.id,
				id: "",
			};
			const taskCreatedResponse = await addTask(newTask);

			socket.emit(
				"user_mentioned",
				[...mentionedUserId],
				taskCreatedResponse.id,
				user.id,
			);
			setShowNewIssue(false);
			setNewIssueData({});
		} catch (err) {
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
				<input
					value={titleInput}
					onChange={handleTitleChange}
					placeholder={"Issue title..."}
					className="focus:outline-none bg-transparent text-2xl"
				/>
				<MentionInput
					data={users}
					value={descriptionInput}
					placeholder={"Add description..."}
					className={
						"w-full leading-6 min-h-min h-full py-4 text-lg mt-2 bg-transparent rounded-lg mb-1 focus:outline-none resize-none break-words break-all whitespace-normal"
					}
					name={"addDescription"}
					onChange={handleDescriptionChange}
				/>
				<DesignationsContainer location={"newIssue"} />
				<DialogFooter>
					<Button
						onClick={handleDiscard}
						className="hover:cursor-pointer bg-transparent"
						variant="destructive"
					>
						Discard
					</Button>
					<Button onClick={handleCreateIssue} className="hover:cursor-pointer">
						Create Issue
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default NewIssueModal;
