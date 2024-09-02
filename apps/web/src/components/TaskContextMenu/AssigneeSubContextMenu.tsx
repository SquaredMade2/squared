import type { FC } from "react";
import { UserSearch } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/typeScriptReduxHooks";
import {
	ContextMenuItem,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
} from "../ui/context-menu";
import ProfileImage from "../ProfileImage";
import type { AssigneeSubContextMenuProps } from "@/components/TaskContextMenu/ContextMenu.interfaces";
import { type Assignee, EventType } from "@/interfaces/event.interfaces";
import useLogTaskEvent from "@/hooks/useLogTaskEvent";
import type {
	AssigneeParams,
	HandleAssigneeChange,
} from "@/app/interfaces/Tasks.interfaces";
import { getAllTasks, setAssignee } from "@/store/taskData/thunks";
import { getSingleTask } from "@/store/task/thunks";
import { ScrollBar, ScrollArea } from "@/components/ui/scroll-area";

const AssigneeSubContextMenu: FC<AssigneeSubContextMenuProps> = ({ task }) => {
	const dispatch = useAppDispatch();

	const taskDataReceived =
		useAppSelector((state) => state.singleTask?.data) || null;

	const currentTeam = useAppSelector((state) => state.taskData.currentTeam);

	const assignees = useAppSelector(
		(state) => state.taskData.allUsersInWorkspace,
	);

	const {
		author,
		storeCommonFields,
		storeTaskAssignee,
		storeType,
		updateTaskAssignee,
	} = useLogTaskEvent();

	const assigneeDropdownHeight = () => {
		const assigneeLength = assignees.length;
		switch (assigneeLength) {
			case 1:
				return "4rem";
			case 2:
				return "6rem";
			case 3:
				return "8rem";
			default:
				return "12rem";
		}
	};

	const handleStoreCurrentAssignee = (): void => {
		const noUserAssigned = task.assigneeName === null;
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
			dispatch(getSingleTask(task.id));
		}
		return { taskId: taskId, assignee: { id: user.id, name: user.name } };
	};

	const handleAssigneeChange: HandleAssigneeChange = async (taskId, user) => {
		dispatch(setAssignee(assigneeParams(taskId, user)));
		if (task !== undefined) {
			dispatch(getSingleTask(task.id));
		}
		await dispatch(getAllTasks(currentTeam));
	};

	const handleClickAssignee = (taskId: string, newAssignee: Assignee): void => {
		if (newAssignee.name === task.assigneeName) return;
		storeCommonFields(author, taskId);
		storeType(EventType.AssigneeUpdated);
		handleStoreCurrentAssignee();
		handleAssigneeChange(taskId, newAssignee);
		logAssigneeChangeEvent(newAssignee);
	};
	return (
		<ContextMenuSub>
			<ContextMenuSubTrigger>
				<div className="mr-2">
					<UserSearch className="size-5 text-[#9597AD]" />
				</div>
				Assignee
			</ContextMenuSubTrigger>
			<ContextMenuSubContent>
				{/* Has to be incline styling, classes that limit height dont trigger the ScrollArea component */}
				<ScrollArea
					className="max-w-96"
					style={{ height: assigneeDropdownHeight() }}
				>
					<ContextMenuItem
						className="w-40"
						onClick={() =>
							handleClickAssignee(task.id, { id: null, name: null })
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
								key={assignee.user}
								onClick={() => handleClickAssignee(task.id, formattedAssignee)}
							>
								<ProfileImage
									profileName={assignee.username}
									location={"contextMenu"}
								/>
								{assignee.username}
							</ContextMenuItem>
						);
					})}
					<ScrollBar orientation="vertical" />
				</ScrollArea>
			</ContextMenuSubContent>
		</ContextMenuSub>
	);
};

export default AssigneeSubContextMenu;
