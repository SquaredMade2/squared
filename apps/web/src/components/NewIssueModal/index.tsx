import { useState, useEffect, useContext } from "react";
import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogFooter,
	DialogClose,
} from "../ui/dialog";

import { useSelector } from "react-redux";
import { useToast } from "../ui/use-toast";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@repo/ui/menu";

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
import NewIssueTopRow from "@/components/NewIssueTopRow";
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
import type { Task } from "@/store/taskData/taskData.interfaces";
import type { OnChangeHandlerFunc } from "react-mentions";
import { Button } from "../ui/button";

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
	const [showCloseModal, setShowCloseModal] = useState(false); // confirmation modal

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
			setShowCloseModal(true);
			// dispatch(setResumeNewIssue(true));
		} else {
			dispatch(setShowNewIssue(false));
			setShowCloseModal(false);
		}
	};

	const handleCancelClose = () => {
		setShowCloseModal(false);
	};

	const handleDiscard = () => {
		setShowCloseModal(false);
		setTitleInput("");
		dispatch(setShowNewIssue(false));
		setDescriptionInput("");
		dispatch(setResumeNewIssue(false));
		dispatch(setStatus("Todo"));
		dispatch(setPriority(""));
		dispatch(setLabels([]));
		dispatch(setDueDate(null));
		dispatch(setEffortEstimate(null));
	};

	const handleClickAway = (titleInput: string, descriptionInput: string) => {
		if (
			!titleInput &&
			!descriptionInput &&
			!priority &&
			labels.length === 0 &&
			!dueDate &&
			!effortEstimate
		) {
			dispatch(setShowNewIssue(false));
			dispatch(setResumeNewIssue(false));
		} else {
			dispatch(setResumeNewIssue(true));
			dispatch(setShowNewIssue(false));
		}
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
				taskCreatedResponse._id,
				user._id,
			);
			dispatch(getAllTasks(currentTeam));
			dispatch(setShowNewIssue(false));
			setTitleInput("");
			setDescriptionInput("");
			dispatch(setStatus("Todo"));
			dispatch(setPriority(""));
			dispatch(setLabels([]));
			dispatch(setDueDate(null));
			dispatch(setEffortEstimate(null));
		} catch (err) {}
	};

	return (
		<Dialog
			open={showNewIssue}
			onOpenChange={() => handleClickAway(titleInput, descriptionInput)}
		>
			<DialogContent className="max-w-full bg-popover" showCloseButton={false}>
				<DialogTitle>
					<NewIssueTopRow
						showCloseModal={showCloseModal}
						handleCancelClose={handleCancelClose}
						handleDiscard={handleDiscard}
						handleCloseClick={handleCloseClick}
					/>
				</DialogTitle>
				<input
					value={titleInput}
					onChange={handleTitleChange}
					placeholder={"Issue title..."}
					className="focus:outline-none bg-transparent"
				/>
				<MentionInput
					data={listOfUsers}
					value={descriptionInput}
					placeholder={"Add description..."}
					className={
						"w-full leading-6 min-h-min h-full py-4 text-xl mt-2 bg-transparent rounded-lg mb-1 focus:outline-none resize-none break-words break-all whitespace-normal"
					}
					name={"addDescription"}
					onChange={handleDescriptionChange}
				/>
				<DesignationsContainer location={"newIssue"} />
				<DialogFooter>
					<Button onClick={handleCreateIssue} className="hover:cursor-pointer">
						Create Issue
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default NewIssueModal;
