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
	const Designations = [
		{ name: "Status", component: <StatusDropdown /> },
		{ name: "Priority", component: <PriorityDropdown /> },
		{ name: "Labels", component: <LabelCombobox /> },
		{ name: "Due Date", component: <DatePicker /> },
		{
			name: "Effort",
			component: <EffortEstimateDropdown />,
			extraComponent: <EffortModal />,
		},
		{ name: "Assignee", component: <AssigneeCombobox /> },
		{ name: "Parent Task", component: <ParentTaskCombobox /> },
		{ name: "Sprint", component: <SprintCombobox /> },
	];

	return (
		<div className="flex flex-col relative w-full z-1 rounded-xl p-5 gap-5 bg-card">
			{Designations.map((designation) => (
				<div key={designation.name} className="flex flex-row w-full">
					<div className="flex items-center shrink-0 text-muted-foreground text-sm font-semibold my-1 w-[95px]">
						<span
							className={`${designation.name === "Labels" && "self-start"}`}
						>
							{designation.name}
						</span>
						{designation.extraComponent && (
							<div className="ml-1.5 flex items-center">
								{designation.extraComponent}
							</div>
						)}
					</div>
					{designation.component}
				</div>
			))}
		</div>
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
