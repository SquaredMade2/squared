import AssigneeCombobox from "./AssigneeCombobox";
import BlockedByCombobox from "./BlockedByCombobox";
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
		{ name: "Blocked By", component: <BlockedByCombobox /> },
	];

	return (
		<div className="relative z-1 flex w-full flex-col gap-5 rounded-xl bg-card p-5">
			{Designations.map((designation) => (
				<div key={designation.name} className="flex w-full flex-row">
					<div className="my-1 flex w-[95px] shrink-0 items-center font-semibold text-muted-foreground text-sm">
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
		<div className="flex w-full flex-wrap gap-2 md:hidden">
			<StatusDropdown />
			<PriorityDropdown />
			<AssigneeCombobox />
			<LabelCombobox />
		</div>
	);
}
