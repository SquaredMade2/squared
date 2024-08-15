import { UserSearch } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/typeScriptReduxHooks";
import {
	ContextMenuItem,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
} from "../ui/context-menu";
import ProfileImage from "../ProfileImage";
import { AssigneeSubContextMenuProps } from "@/app/interfaces/ContextMenu.interfaces";
import { Assignee, EventType } from "@/interfaces/event.interfaces";
import useLogTaskEvent from "@/hooks/useLogTaskEvent";
import {
	AssigneeParams,
	HandleAssigneeChange,
} from "@/app/interfaces/Tasks.interfaces";
import { getAllTasks, setAssignee } from "@/store/taskData/thunks";
import { getSingleTask } from "@/store/task/thunks";

const styles = {
	contentWrapper: "",
	centerIcon: "mr-2",
};

const AssigneeSubContextMenu: React.FC<AssigneeSubContextMenuProps> = ({
	task,
}) => {
	const dispatch = useAppDispatch();

	const taskDataReceived =
		useAppSelector((state) => state.singleTask?.data) || null;

	const currentTeam = useAppSelector((state) => state.taskData.currentTeam);

	const {
		author,
		storeCommonFields,
		storeTaskAssignee,
		storeType,
		updateTaskAssignee,
	} = useLogTaskEvent();

	const handleStoreCurrentAssignee = (): void => {
		const noUserAssigned = task.assignee?.name === null;
		if (taskDataReceived) {
			if (noUserAssigned) {
				const assignee = {
					id: "",
					name: "not Assigned",
				};
				storeTaskAssignee(assignee);
			} else {
				storeTaskAssignee(task.assignee as Assignee);
			}
		}
	};

	const logAssigneeChangeEvent = (newAssignee: Assignee): void => {
		const userIsAssigned = newAssignee.id && newAssignee.name;
		if (userIsAssigned) {
			updateTaskAssignee(newAssignee);
		} else {
			updateTaskAssignee({ id: "", name: "not Assigned" });
		}
	};

	const assigneeParams: AssigneeParams = (taskId, user) => {
		dispatch(getAllTasks(currentTeam));
		if (task !== undefined) {
			dispatch(getSingleTask(task._id));
		}
		return { taskId: taskId, assignee: { id: user.id, name: user.name } };
	};

	const handleAssigneeChange: HandleAssigneeChange = async (taskId, user) => {
		dispatch(setAssignee(assigneeParams(taskId, user)));
		if (task !== undefined) {
			dispatch(getSingleTask(task._id));
		}
		await dispatch(getAllTasks(currentTeam));
	};

	const handleClickAssignee = (taskId: string, newAssignee: Assignee): void => {
		if (newAssignee.name === task.assignee?.name) return;
		storeCommonFields(author, taskId);
		storeType(EventType.AssigneeUpdated);
		handleStoreCurrentAssignee();
		handleAssigneeChange(taskId, newAssignee);
		logAssigneeChangeEvent(newAssignee);
	};
	const assignees = useAppSelector(
		(state) => state.taskData.allUsersInWorkspace,
	);
	return (
		<ContextMenuSub>
			<ContextMenuSubTrigger>
				<div className={styles.centerIcon}>
					<UserSearch className="size-5 text-[#9597AD]" />
				</div>
				Assignee
			</ContextMenuSubTrigger>
			<ContextMenuSubContent>
				<ContextMenuItem
					onClick={() =>
						handleClickAssignee(task._id, { id: null, name: null })
					}
				>
					Unassign
				</ContextMenuItem>
				{assignees.map((assignee) => {
					const formattedAssignee = {
						id: assignee.user,
						name: assignee.username,
					};
					return (
						<ContextMenuItem
							onClick={() => handleClickAssignee(task._id, formattedAssignee)}
						>
							<ProfileImage
								profileName={assignee.username}
								location={"taskCard"}
							/>
							{assignee.username}
						</ContextMenuItem>
					);
				})}
			</ContextMenuSubContent>
		</ContextMenuSub>
	);
};

export default AssigneeSubContextMenu;
