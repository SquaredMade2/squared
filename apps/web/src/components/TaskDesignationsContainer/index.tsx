import { useState } from "react";
import PriorityButton from "./components/Buttons/PriorityButton";
import StatusButton from "./components/Buttons/StatusButton";
import DateButton from "./components/Buttons/DateButton";
import EffortEstimateButton from "./components/Buttons/EffortEstimateButton";
import LabelButton from "./components/Buttons/LabelButton";
import { AssigneeButton } from "./components/Buttons/AssigneeButton";
import HelpButton from "@/components/HelpButton";
import EffortModal from "@/components/EffortModal";
import { useToast } from "../ui/use-toast";
import { useTaskStore } from "@/storeZ";
import type { User, Task } from "@repo/db";
import type { ButtonProps } from "./Button.interfaces";

export const setBackgroundColor = (theme: string | undefined) => {
	if (theme === "light") {
		return "hover:bg-gray-50";
	}
	return "hover:bg-accent";
};

const generateItemContainer = (
	text: string,
	ButtonComponent: React.ComponentType<ButtonProps>,
	currentTask: Task | null,
	ExtraComponent?: React.ReactNode,
): JSX.Element => (
	<div className="flex flex-row flex-start items-center w-full">
		<div className="flex items-center shrink-0 text-muted-foreground text-sm font-semibold my-1 w-[95px]">
			<span>{text}</span>
			{ExtraComponent && (
				<div className="ml-1.5 flex items-center">{ExtraComponent}</div>
			)}
		</div>
		<ButtonComponent currentTask={currentTask} />
	</div>
);

export default function TaskDesignationsContainer() {
	const { toast } = useToast();
	const { updateTask, currentTask } = useTaskStore((state) => state);
	const [showEffortModal, setShowEffortModal] = useState(false);

	const handleOpenModal = () => setShowEffortModal(true);
	const handleCloseModal = () => setShowEffortModal(false);

	const handleAssigneeChange = async (taskId: string, user: User) => {
		try {
			await updateTask(taskId, {
				assigneeId: user.id,
				assigneeName: user.name,
			});
			toast({ title: "Assignee updated successfully" });
		} catch (error) {
			toast({ title: "Failed to update assignee", variant: "destructive" });
		}
	};

	const generateAssigneeContainer: () => React.JSX.Element = () => {
		return (
			<div className="flex flex-col">
				<div className="flex flex-row flex-start items-center">
					<div className="flex items-center shrink-0 text-muted-foreground text-sm font-semibold my-1 w-[95px]">
						Assignee
					</div>
					<AssigneeButton
						currentTask={currentTask}
						handleAssigneeChange={handleAssigneeChange}
					/>
				</div>
			</div>
		);
	};

	return (
		<>
			<div className="flex flex-col relative w-full z-[1] rounded-lg p-5 gap-5 bg-card">
				{generateItemContainer("Status", StatusButton, currentTask)}
				{generateItemContainer("Priority", PriorityButton, currentTask)}
				{generateItemContainer("Labels", LabelButton, currentTask)}
				{generateItemContainer("Due Date", DateButton, currentTask)}
				{generateItemContainer(
					"Effort",
					EffortEstimateButton,
					currentTask,
					<HelpButton onClick={handleOpenModal} />,
				)}
				{generateAssigneeContainer()}
			</div>
			<EffortModal isOpen={showEffortModal} onClose={handleCloseModal} />
		</>
	);
}
