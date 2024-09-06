import { useState } from "react";
import type React from "react";
import { formatDate } from "date-fns/format";
import TaskCardPriority from "@/components/TaskCardPriority";
import TaskCardStatus from "@/components/TaskCardStatus";
import { truncateString } from "@/utils/formatting";
import ProfileImage from "@/components/ProfileImage";
import { AssigneeDropdown } from "@/components/AssigneeDropdown";
import TaskCardLabels from "@/components/TaskCardLabels";
import { UserSearch } from "lucide-react";
import type { TaskCardTitleProps } from "./TaskCardTitle.interfaces";
import {
	useAuthStore,
	useTaskStore,
	useTeamStore,
	useViewsStore,
} from "@/storeZ/provider";
import type { User } from "@repo/db";

const TaskCardTitle = ({
	taskTitle,
	task,
	isShown,
	highlightText,
	location,
}: TaskCardTitleProps) => {
	const { view, showDateTime, showLabels } = useViewsStore().getState();
	const { user } = useAuthStore().getState();
	const { getAllTasks, updateTask } = useTaskStore().getState();
	const { currentTeam } = useTeamStore().getState();

	const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);

	const handleAssigneeIcon = () => {
		return task.assigneeName ? (
			<ProfileImage profileName={task.assigneeName} location="taskCard" />
		) : (
			<UserSearch className="size-5 text-[#9597AD]" />
		);
	};

	const toggleAssigneeDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		e.preventDefault();
		setShowAssigneeDropdown(!showAssigneeDropdown);
	};

	const teamIdentifier =
		location === "dashboard" ? currentTeam?.identifier : task.teamId;

	const handleAssigneeChange = async (taskId: string, user: User) => {
		if (currentTeam) {
			await updateTask(taskId, { assigneeId: user.id });
			await getAllTasks(currentTeam?.id);
		}
	};

	const renderTaskInfo = () => (
		<>
			<div className="flex items-center flex-row gap-2 text-base">
				{isShown && <TaskCardPriority task={task} border={false} />}
				<span className="text-muted-foreground xs:hidden sm:hidden md:flex cursor-pointer">
					{teamIdentifier}
				</span>
				<TaskCardStatus task={task} />
				<span className="truncate">
					{location === "search" ? highlightText(taskTitle) : taskTitle}
				</span>
			</div>
			<div className="flex col-span-4 items-center lg:pr-5 justify-end">
				{showLabels && <TaskCardLabels task={task} view="list" />}
				{showDateTime && (
					<div className="text-muted-foreground md:flex xs:hidden sm:hidden mr-2 mdsm:mr-3">
						{task.dueDate
							? formatDate(new Date(task.dueDate), "MMM dd")
							: "No Date"}
					</div>
				)}
				<button
					type="button"
					onClick={toggleAssigneeDropdown}
					className="cursor-pointer"
				>
					{handleAssigneeIcon()}
				</button>
				{showAssigneeDropdown && (
					<div className="absolute mr-40 mt-10 cursor-pointer">
						<AssigneeDropdown
							taskId={task.id}
							location="Dashboard"
							setShowAssigneeDropdown={setShowAssigneeDropdown}
							handleAssigneeChange={handleAssigneeChange}
						/>
					</div>
				)}
			</div>
		</>
	);

	const renderGridTaskInfo = () => (
		<>
			<div className="flex flex-row justify-between h-[20px] w-full cursor-pointer">
				<p className="text-xs text-muted-foreground">{teamIdentifier}</p>
				<button type="button" onClick={toggleAssigneeDropdown} className="">
					{handleAssigneeIcon()}
				</button>
			</div>
			<div className="text-sm pr-8 cursor-pointer w-full">
				{truncateString(task.title, 70)}
			</div>
			{showAssigneeDropdown && (
				<AssigneeDropdown
					taskId={task.id}
					location="Grid"
					setShowAssigneeDropdown={setShowAssigneeDropdown}
					handleAssigneeChange={handleAssigneeChange}
				/>
			)}
		</>
	);

	return (
		<div
			className={`flex flex-col items-start justify-evenly cursor-pointer ${view === "list" || location === "search" ? "py-1" : ""}`}
		>
			{view === "list" || location === "search"
				? renderTaskInfo()
				: renderGridTaskInfo()}
		</div>
	);
};

export default TaskCardTitle;
