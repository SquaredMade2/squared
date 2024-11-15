import AssigneeCombobox from "./AssigneeCombobox";
import DatePicker from "./DesignationsDatePicker";
import EffortEstimateDropdown from "./EffortEstimateDropdown";
import EffortModal from "./EffortModal";
import LabelCombobox from "./LabelCombobox";
import PriorityDropdown from "./PriorityDropdown";
import StatusDropdown from "./StatusDropdown";

type DesignationItemProps = {
	label: string;
	Component: React.ComponentType;
	ExtraComponent?: React.ReactNode;
};

const DesignationItem = ({
	label,
	Component,
	ExtraComponent,
}: DesignationItemProps) => (
	<div className="flex flex-row items-center w-full">
		<div className="flex items-center shrink-0 text-muted-foreground text-sm font-semibold my-1 w-[95px]">
			<span>{label}</span>
			{ExtraComponent && (
				<div className="ml-1.5 flex items-center">{ExtraComponent}</div>
			)}
		</div>
		<Component />
	</div>
);

export function TaskDesignationsContainer() {
	return (
		<>
			<div className="flex flex-col relative w-full z-[1] rounded-lg p-5 gap-5 bg-card">
				<DesignationItem label="Status" Component={StatusDropdown} />
				<DesignationItem label="Priority" Component={PriorityDropdown} />
				<DesignationItem label="Labels" Component={LabelCombobox} />
				<DesignationItem label="Due Date" Component={DatePicker} />
				<DesignationItem
					label="Effort"
					Component={EffortEstimateDropdown}
					ExtraComponent={<EffortModal />}
				/>
				<DesignationItem label="Assignee" Component={AssigneeCombobox} />
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
