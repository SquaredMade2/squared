import AssigneeCombobox from "./AssigneeCombobox";
import DatePicker from "./DesignationsDatePicker";
import EffortEstimateDropdown from "./EffortEstimateDropdown";
import EffortModal from "./EffortModal";
import LabelCombobox from "./LabelCombobox";
import ParentTaskCombobox from "./ParentTaskCombobox";
import PriorityDropdown from "./PriorityDropdown";
import SprintCombobox from "./SprintCombobox";
import StatusDropdown from "./StatusDropdown";

export function TaskDesignationsContainer() {
	return (
		<>
			<div className="flex flex-col relative w-full z-[1] rounded-lg p-5 gap-5 bg-card">
				<div className="flex flex-row items-center w-full">
					<div className="flex items-center shrink-0 text-muted-foreground text-sm font-semibold my-1 w-[95px]">
						<span>Status</span>
					</div>
					<StatusDropdown />
				</div>
				<div className="flex flex-row items-center w-full">
					<div className="flex items-center shrink-0 text-muted-foreground text-sm font-semibold my-1 w-[95px]">
						<span>Priority</span>
					</div>
					<PriorityDropdown />
				</div>
				<div className="flex flex-row items-center w-full">
					<div className="flex items-center shrink-0 text-muted-foreground text-sm font-semibold my-1 w-[95px]">
						<span>Labels</span>
					</div>
					<LabelCombobox />
				</div>
				<div className="flex flex-row items-center w-full">
					<div className="flex items-center shrink-0 text-muted-foreground text-sm font-semibold my-1 w-[95px]">
						<span>Due Date</span>
					</div>
					<DatePicker />
				</div>
				<div className="flex flex-row items-center w-full">
					<div className="flex items-center shrink-0 text-muted-foreground text-sm font-semibold my-1 w-[95px]">
						<span>Effort</span>
						<div className="ml-1.5 flex items-center">
							<EffortModal />
						</div>
					</div>
					<EffortEstimateDropdown />
				</div>
				<div className="flex flex-row items-center w-full">
					<div className="flex items-center shrink-0 text-muted-foreground text-sm font-semibold my-1 w-[95px]">
						<span>Assignee</span>
					</div>
					<AssigneeCombobox />
				</div>
				<div className="flex flex-row items-center w-full">
					<div className="flex items-center shrink-0 text-muted-foreground text-sm font-semibold my-1 w-[95px]">
						<span>Parent Task</span>
					</div>
					<ParentTaskCombobox />
				</div>
				<div className="flex flex-row items-center w-full">
					<div className="flex items-center shrink-0 text-muted-foreground text-sm font-semibold my-1 w-[95px]">
						<span>Sprint</span>
					</div>
					<SprintCombobox />
				</div>
			</div>
		</>
	);
}
export function MobileTaskSettings() {
	return (
		<div className="flex gap-2 md:hidden flex-wrap w-full">
			<StatusDropdown />
			<PriorityDropdown />
			<AssigneeCombobox />
			<LabelCombobox />
		</div>
	);
}
