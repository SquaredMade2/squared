import { useTeamStore } from "@/store";
import AssigneeCombobox from "./AssigneeCombobox";
import BlockedByCombobox from "./BlockedByCombobox";
import DatePicker from "./DesignationsDatePicker";
import EffortEstimateDropdown from "./EffortEstimateDropdown";
import EffortModal from "./EffortModal";
import LabelCombobox from "./LabelCombobox";
import ParentTaskCombobox from "./ParentTaskCombobox";
import PriorityDropdown from "./PriorityDropdown";
import SprintDropdown from "./SprintDropdown";
import StatusDropdown from "./StatusDropdown";

export function TaskDesignationsContainer() {
	const { team } = useTeamStore((state) => state);
	const Designations = [
		{ component: <StatusDropdown />, name: "Status" },
		{ component: <PriorityDropdown />, name: "Priority" },
		{ component: <LabelCombobox />, name: "Labels" },
		{ component: <DatePicker />, name: "Due Date" },
		{
			component: <EffortEstimateDropdown />,
			extraComponent: <EffortModal />,
			name: "Effort",
		},
		{ component: <AssigneeCombobox />, name: "Assignee" },
		{ component: <ParentTaskCombobox />, name: "Parent Task" },
		{ component: <SprintDropdown />, name: "Sprint" },
		{ component: <BlockedByCombobox />, name: "Blocked By" },
	];

	return (
		<div className="relative z-1 flex w-full flex-col gap-5 rounded-xl bg-card p-5">
			{Designations.map((designation) => {
				if (designation.name === "Sprint" && !team?.sprintsEnabled) return null;
				return (
					<div className="flex w-full flex-row" key={designation.name}>
						<div className="my-1 flex w-[95px] shrink-0 items-center font-semibold text-muted-foreground text-sm">
							<span>{designation.name}</span>
							{designation.extraComponent && (
								<div className="ml-1.5 flex items-center">
									{designation.extraComponent}
								</div>
							)}
						</div>
						{designation.component}
					</div>
				);
			})}
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
