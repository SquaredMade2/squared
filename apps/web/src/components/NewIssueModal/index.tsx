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
import {
	getAllTasks,
	createNewTask,
	incrementCreatedIssues,
} from "@/store/taskData/thunks";
import { setShowNewIssue } from "@/store/showNewIssue";
import { setResumeNewIssue } from "@/store/resumeNewIssue";
import {
	setStatus,
	setLabels,
	setPriority,
	setDueDate,
	setEffortEstimate,
} from "@/store/taskData";
import DesignationsContainer from "@/components/DesignationsContainer";
import { LayoutGrid, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { transformingMentionInputs } from "@/utils/transformingMentionInputs";
import MentionInput from "@/components/MentionsInput";
import { getListOfUsers } from "@/store/userSettings/thunks";
import "@/components/NewIssueModal/NewIssueModal.style.css";
import {
	type WorkspaceMember,
	getListOfMembers,
} from "@/store/workspaceMembers";
import { SocketContext } from "@/app/SocketProvider";
import type { RootState } from "@/store";
import { useAppDispatch } from "@/hooks/typeScriptReduxHooks";
import type { Task } from "@repo/db";
import type { OnChangeHandlerFunc } from "react-mentions";

const NewIssueModal = () => {
	const { toast } = useToast();
	const dispatch = useAppDispatch();
	const showNewIssue = useSelector(
		(state: RootState) => state.showNewIssue.isOpen,
	);
	const authorId = useSelector(
		(state: RootState) => state.userSettings.user?._id,
	);

	const {
		currentTeam,
		status,
		priority,
		labels,
		dueDate,
		effortEstimate,
		currentWorkspace,
		taskList,
	} = useSelector((state: RootState) => state.taskData);

	const taskListTitle = taskList.map((el) => el.title);
	const [titleInput, setTitleInput] = useState("");
	const [descriptionInput, setDescriptionInput] = useState("");
	const [listOfUsers, SetListOfUsers] = useState<WorkspaceMember[]>([]);

	const socket = useContext(SocketContext);
	const user = useSelector((state: RootState) => state.userSettings.user);

	const getListOfWorkspaceMembers = async () => {
		try {
			const members = (await Promise.all(
				currentWorkspace.users.map(async (member) => {
					const user = await getListOfUsers(member?.user);
					return {
						display: user?.name,
						id: user?._id.toString(),
						email: user?.email,
					} as {
						display: string;
						id: string;
						email: string;
					};
				}),
			)) as unknown as WorkspaceMember[];
			dispatch(getListOfMembers(members));
			SetListOfUsers(members);
		} catch (error) {}
	};

	useEffect(() => {
		getListOfWorkspaceMembers();
	}, []);

	const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTitleInput(e.target.value);
	};

	const handleDescriptionChange: OnChangeHandlerFunc = (e) => {
		setDescriptionInput(e.target.value);
	};

	const handleCloseClick = () => {
		if (
			titleInput ||
			descriptionInput ||
			priority ||
			labels.length > 0 ||
			dueDate ||
			effortEstimate
		) {
			dispatch(setResumeNewIssue(true));
			dispatch(setShowNewIssue(false));
		} else {
			dispatch(setShowNewIssue(false));
		}
	};

	const handleDiscard = () => {
		setTitleInput("");
		setDescriptionInput("");
		dispatch(setShowNewIssue(false));
		dispatch(setResumeNewIssue(false));
		dispatch(setStatus("Todo"));
		dispatch(setPriority(""));
		dispatch(setLabels([]));
		dispatch(setDueDate(undefined));
		dispatch(setEffortEstimate(null));
	};

	const handleCreateIssue = async () => {
		if (titleInput.replace(/\s+/g, "").length === 0) {
			toast({
				title: "Please Enter a Title!",
				variant: "destructive",
			});
			return;
		}
		if (taskListTitle.includes(titleInput)) {
			toast({
				title: `${titleInput} already exists`,
				variant: "destructive",
			});
			return;
		}
		dispatch(incrementCreatedIssues(currentWorkspace._id));
		try {
			const { transformedInput: transformedTitle, userIds: titleUserId } =
				transformingMentionInputs(titleInput);
			const {
				transformedInput: transformedDescriptionInput,
				userIds: descriptionUserId,
			} = transformingMentionInputs(descriptionInput);
			const mentionedUserId = new Set([...descriptionUserId, ...titleUserId]);
			const newTask: Task = {
				authorId: authorId,
				title: transformedTitle,
				description: transformedDescriptionInput,
				identifier: `${currentTeam.identifier}-${currentWorkspace.issuesCreated}`,
				status: status,
				priority: priority,
				labels: labels,
				dueDate: dueDate,
				effortEstimate: effortEstimate,
				team: currentTeam,
				dateCreated: new Date(),
				assignee: null,
				taskName: titleInput,
				_id: "",
			};
			const taskCreatedResponse = await dispatch(
				createNewTask(newTask as Task),
			).unwrap();

			dispatch(setResumeNewIssue(false));

			socket.emit(
				"user_mentioned",
				[...mentionedUserId],
				taskCreatedResponse.id,
				user._id,
			);
			dispatch(getAllTasks(currentTeam));
			dispatch(setShowNewIssue(false));
			setTitleInput("");
			setDescriptionInput("");
			dispatch(setStatus("Todo"));
			dispatch(setPriority(""));
			dispatch(setLabels([]));
			dispatch(setDueDate(undefined));
			dispatch(setEffortEstimate(null));
		} catch (err) {}
	};

	return (
		<Dialog open={showNewIssue} onOpenChange={() => handleCloseClick()}>
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
					data={listOfUsers}
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
