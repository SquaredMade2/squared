import { useState } from "react";
import LabelButton from "@/components/LabelButton";
import PriorityButton from "@/components/PriorityButton";
import { StatusDropdownButton } from "@/components/StatusDropdownButton";
import DateButton from "@/components/DateButton";
import EffortEstimateButton from "@/components/EffortEstimateButton";
import HelpButton from "@/components/HelpButton";
import EffortModal from "@/components/EffortModal";
import { AssigneeButton } from "@/components/AssigneeButton";
import { useAppDispatch, useAppSelector } from "@/hooks/typeScriptReduxHooks";
import { getAllTasks, setAssignee } from "@/store/taskData/thunks";
import { AssigneeDropdown } from "@/components/AssigneeDropdown";
import { getSingleTask } from "@/store/task/thunks";
import type {
	AssigneeParams,
	HandleAssigneeChange,
} from "@/app/interfaces/Tasks.interfaces";
import type { DesignationsContainerProps } from "./DesignationsContainer.interfaces";
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

const DesignationsContainer = ({ location }: DesignationsContainerProps) => {
	const dispatch = useAppDispatch();
	const { toast } = useToast();
	const currentTeam = useAppSelector((state) => state.taskData.currentTeam);
	const task = useAppSelector((state) => state.singleTask.data);
	const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
	const [showEffortModal, setShowEffortModal] = useState(false);

	const handleOpenModal = () => setShowEffortModal(true);
	const handleCloseModal = () => setShowEffortModal(false);

	const assigneeParams: AssigneeParams = (taskId, user) => {
		dispatch(getAllTasks(currentTeam));
		if (task !== undefined) {
			try {
				dispatch(getSingleTask(task._id));
			} catch (error) {
				toast({
					title: "Error",
					description: "Failed to get task",
					variant: "destructive",
				});
			}
		}
		return {
			taskId: taskId,
			assignee: {
				id: user.id,
				name: user.name,
				username: "",
				email: "",
				password: "",
				verified: true,
				lastLogin: new Date(),
				onBoarding: false,
				defaultWorkspaceId: "",
			},
		};
	};

	const handleAssigneeChange: HandleAssigneeChange = async (taskId, user) => {
		dispatch(setAssignee(assigneeParams(taskId, user)));
		if (task !== undefined) {
			try {
				dispatch(getSingleTask(task._id));
			} catch (error) {
				toast({
					title: "Error",
					description: "Failed to get task",
					variant: "destructive",
				});
			}
		}
		await dispatch(getAllTasks(currentTeam));
	};

	const generateAssigneeContainer: () => React.JSX.Element = () => {
		return (
			<div className="flex flex-col">
				<div className="flex flex-row flex-start items-center">
					<div className="flex items-center shrink-0 text-muted-foreground text-sm font-semibold my-1 w-[95px]">
						Assignee
					</div>
					<AssigneeButton
						location={location}
						showAssigneeDropdown={showAssigneeDropdown}
						setShowAssigneeDropdown={setShowAssigneeDropdown}
					/>
				</div>
				<div className="absolute mt-10">
					{showAssigneeDropdown && task !== undefined && (
						<AssigneeDropdown
							taskId={task?._id}
							location={"taskPage"}
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
			{location === "newIssue" && (
				<div className="flex flex-row flex-start items-center h-9">
					<StatusDropdownButton location={location} />
					<PriorityButton location={location} />
					<LabelButton location={location} />
					<DateButton location={location} />
					<EffortEstimateButton location={location} />
				</div>
			)}

			{location === "issueSidebar" && (
				<div className="flex flex-col relative w-full z-[1] rounded-lg p-5 gap-5 bg-card">
					{generateItemContainer("Status", StatusDropdownButton, location)}
					{generateItemContainer("Priority", PriorityButton, location)}
					{generateItemContainer("Labels", LabelButton, location)}
					{generateItemContainer("Due Date", DateButton, location)}
					{generateItemContainer(
						"Effort",
						EffortEstimateButton,
						location,
						<HelpButton onClick={handleOpenModal} />,
					)}
					{generateAssigneeContainer()}
				</div>
			)}
			<EffortModal isOpen={showEffortModal} onClose={handleCloseModal} />
		</>
	);
};

export default DesignationsContainer;
