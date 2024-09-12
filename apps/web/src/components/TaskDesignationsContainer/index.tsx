import { useState } from "react";
import PriorityButton from "@/components/PriorityButton";
import { StatusDropdownButton } from "@/components/StatusDropdownButton";
import DateButton from "@/components/DateButton";
import EffortEstimateButton from "@/components/EffortEstimateButton";
import LabelDropdownButton from "../LabelDropdownButton";
import HelpButton from "@/components/HelpButton";
import EffortModal from "@/components/EffortModal";
import { AssigneeButton } from "./components/AssigneeButton";
// import { useAppDispatch, useAppSelector } from "@/hooks/typeScriptReduxHooks";
// import { getAllTasks, setAssignee } from "@/store/taskData/thunks";
import { AssigneeDropdown } from "@/components/AssigneeDropdown";
// import { getSingleTask } from "@/store/task/thunks";
import {useTaskStore} from '@/storeZ/tasks'
import { useActivityStore } from "@/storeZ";
// import {getAllTasks, getTask, updateTask} from '@/storeZ/tasks'
import type {
	// AssigneeParams,
	HandleAssigneeChange,
} from "@/app/interfaces/Tasks.interfaces";
import type { Task } from "@repo/db";
import { useToast } from "../ui/use-toast";

export const setBackgroundColor = (theme: string) => {
	if (theme === "light") {
		return "hover:bg-gray-50";
	}
	return "hover:bg-accent";
};

const generateItemContainer = (
	text: string,
	ButtonComponent: React.ComponentType<DesignationsContainerProps>,
	location: string,
	ExtraComponent?: React.ReactNode,
): JSX.Element => (
	<div className="flex flex-row flex-start items-center w-full">
		<div className="flex items-center shrink-0 text-muted-foreground text-sm font-semibold my-1 w-[95px]">
			<span>{text}</span>
			{ExtraComponent && (
				<div className="ml-1.5 flex items-center">{ExtraComponent}</div>
			)}
		</div>
		<ButtonComponent location={location} />
	</div>
);

export default function TaskDesignationsContainer ({currentTask}: {currentTask: Task | null}) {
	const { toast } = useToast();
  const {updateTask, getTask} = useTaskStore((state) => state);
  const {getTaskEvents} = useActivityStore((state) => state);
	// const currentTeam = useAppSelector((state) => state.taskData.currentTeam);
	const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
	const [showEffortModal, setShowEffortModal] = useState(false);

	const handleOpenModal = () => setShowEffortModal(true);
	const handleCloseModal = () => setShowEffortModal(false);

	const handleAssigneeChange: HandleAssigneeChange = async (taskId, user) => {
    await updateTask(taskId, { assigneeId: user.id, assigneeName: user.name });
    await getTaskEvents(taskId);
		if (currentTask !== undefined || currentTask !== null) {
			try {
				getTask(taskId)
			} catch (error) {
				toast({
					title: "Error",
					description: "Failed to get task",
					variant: "destructive",
				});
			}
		}
		// await dispatch(getAllTasks(currentTeam));
	};

	const generateAssigneeContainer: () => React.JSX.Element = () => {
		return (
			<div className="flex flex-col">
				<div className="flex flex-row flex-start items-center">
					<div className="flex items-center shrink-0 text-muted-foreground text-sm font-semibold my-1 w-[95px]">
						Assignee
					</div>
					<AssigneeButton
						showAssigneeDropdown={showAssigneeDropdown}
						setShowAssigneeDropdown={setShowAssigneeDropdown}
					/>
				</div>
				<div className="absolute mt-10">
					{showAssigneeDropdown && task !== undefined && (
						<AssigneeDropdown
							taskId={task?._id}
							setShowAssigneeDropdown={setShowAssigneeDropdown}
							handleAssigneeChange={handleAssigneeChange}
						/>
					)}
				</div>
			</div>
		);
	};

	return (
		<>
				<div className="flex flex-col relative w-full z-[1] rounded-lg p-5 gap-5 bg-card">
					{generateItemContainer("Status", StatusDropdownButton, location)}
					{generateItemContainer("Priority", PriorityButton, location)}
					{generateItemContainer("Labels", LabelDropdownButton, location)}
					{generateItemContainer("Due Date", DateButton, location)}
					{generateItemContainer(
						"Effort",
						EffortEstimateButton,
						location,
						<HelpButton onClick={handleOpenModal} />,
					)}
					{generateAssigneeContainer()}
				</div>
			<EffortModal isOpen={showEffortModal} onClose={handleCloseModal} />
		</>
	);
};
