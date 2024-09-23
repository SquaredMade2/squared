import { useState } from "react";
import type { Task } from "@repo/db";
import PriorityDropdown from "./PriorityDropdown";
import StatusDropdown from "./StatusDropdown";
import DatePicker from "./DatePicker";
import EffortEstimateDropdown from "./EffortEstimateDropdown";
import LabelCombobox from "./LabelCombobox";
import AssigneeCombobox from "./AssigneeCombobox";
import EffortModal from "@/components/EffortModal";
import { Button } from "@/components/ui/button";
import { CircleHelp } from "lucide-react";

type ButtonProps = {
	currentTask: Task | null;
};

type DesignationItemProps = {
	label: string;
	Component: React.ComponentType<ButtonProps>;
	currentTask: Task | null;
	ExtraComponent?: React.ReactNode;
};

const DesignationItem = ({
	label,
	Component,
	currentTask,
	ExtraComponent,
}: DesignationItemProps) => (
	<div className="flex flex-row items-center w-full">
		<div className="flex items-center shrink-0 text-muted-foreground text-sm font-semibold my-1 w-[95px]">
			<span>{label}</span>
			{ExtraComponent && (
				<div className="ml-1.5 flex items-center">{ExtraComponent}</div>
			)}
		</div>
		<Component currentTask={currentTask} />
	</div>
);

export function TaskDesignationsContainer({
	task: currentTask,
}: { task: Task }) {
	const [showEffortModal, setShowEffortModal] = useState(false);

	const handleOpenModal = () => setShowEffortModal(true);
	const handleCloseModal = () => setShowEffortModal(false);

	return (
		<>
			<div className="flex flex-col relative w-full z-[1] rounded-lg p-5 gap-5 bg-card">
				<DesignationItem
					label="Status"
					Component={StatusDropdown}
					currentTask={currentTask}
				/>
				<DesignationItem
					label="Priority"
					Component={PriorityDropdown}
					currentTask={currentTask}
				/>
				<DesignationItem
					label="Labels"
					Component={LabelCombobox}
					currentTask={currentTask}
				/>
				<DesignationItem
					label="Due Date"
					Component={DatePicker}
					currentTask={currentTask}
				/>
				<DesignationItem
					label="Effort"
					Component={EffortEstimateDropdown}
					currentTask={currentTask}
					ExtraComponent={
						<Button
							variant="ghost"
							size="icon"
							onClick={handleOpenModal}
							className="rounded-full hover:bg-transparent"
						>
							<CircleHelp className="size-4 text-muted-foreground" />
						</Button>
					}
				/>
				<DesignationItem
					label="Assignee"
					Component={AssigneeCombobox}
					currentTask={currentTask}
				/>
			</div>
			<EffortModal isOpen={showEffortModal} onClose={handleCloseModal} />
		</>
	);
}
export function MobileTaskSettings({ task }: { task: Task }) {
	return (
		<div className="flex gap-2 md:hidden">
			<StatusDropdown currentTask={task} />
			<PriorityDropdown currentTask={task} />
			<AssigneeCombobox currentTask={task} />
			<LabelCombobox currentTask={task} />
		</div>
	);
}
