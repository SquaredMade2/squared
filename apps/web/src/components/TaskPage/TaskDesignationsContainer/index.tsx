import type { Task } from "@squared/db";
import DatePicker from "./DesignationsDatePicker";
import EffortEstimateDropdown from "./EffortEstimateDropdown";
// import AssigneeCombobox from "./AssigneeCombobox";
import EffortModal from "./EffortModal";
import LabelCombobox from "./LabelCombobox";
import PriorityDropdown from "./PriorityDropdown";
import StatusDropdown from "./StatusDropdown";

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
					ExtraComponent={<EffortModal />}
				/>
				{/* <DesignationItem
					label="Assignee"
					Component={AssigneeCombobox}
					currentTask={currentTask}
				/> */}
			</div>
		</>
	);
}
export function MobileTaskSettings({ task }: { task: Task }) {
	return (
		<div className="flex gap-2 md:hidden flex-wrap w-full">
			<StatusDropdown currentTask={task} />
			<PriorityDropdown currentTask={task} />
			{/* <AssigneeCombobox currentTask={task} /> */}
			<LabelCombobox currentTask={task} />
		</div>
	);
}
