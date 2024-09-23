import { useState } from "react";
import PriorityDropdown from "./PriorityDropdown";
import StatusDropdown from "./StatusDropdown";
import DatePicker from "./DatePicker";
import EffortEstimateDropdown from "./EffortEstimateDropdown";
import LabelCombobox from "./LabelCombobox";
import AssigneeCombobox from "./AssigneeCombobox";
import HelpButton from "./HelpButton";
import EffortModal from "@/components/EffortModal";
import { useTaskStore } from "@/store";
import type { Task } from "@repo/db";
import type { ButtonProps } from "./interfaces";

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
	const { currentTask } = useTaskStore((state) => state);
	const [showEffortModal, setShowEffortModal] = useState(false);

	const handleOpenModal = () => setShowEffortModal(true);
	const handleCloseModal = () => setShowEffortModal(false);
	const generateAssigneeContainer: () => React.JSX.Element = () => {
		return (
			<div className="flex flex-col">
				<div className="flex flex-row flex-start items-center">
					<div className="flex items-center shrink-0 text-muted-foreground text-sm font-semibold my-1 w-[95px]">
						Assignee
					</div>
					<AssigneeCombobox currentTask={currentTask} />
				</div>
			</div>
		);
	};

	return (
		<>
			<div className="flex flex-col relative w-full z-[1] rounded-lg p-5 gap-5 bg-card">
				{generateItemContainer("Status", StatusDropdown, currentTask)}
				{generateItemContainer("Priority", PriorityDropdown, currentTask)}
				{generateItemContainer("Labels", LabelCombobox, currentTask)}
				{generateItemContainer("Due Date", DatePicker, currentTask)}
				{generateItemContainer(
					"Effort",
					EffortEstimateDropdown,
					currentTask,
					<HelpButton onClick={handleOpenModal} />,
				)}
				{generateAssigneeContainer()}
			</div>
			<EffortModal isOpen={showEffortModal} onClose={handleCloseModal} />
		</>
	);
}
