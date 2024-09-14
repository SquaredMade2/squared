import PriorityButton from "@/components/PriorityButton";
import StatusDropdownButton from "@/components/StatusDropdownButton";
import DateButton from "@/components/DateButton";
import EffortEstimateButton from "@/components/EffortEstimateButton";
import LabelDropdownButton from "../LabelDropdownButton";
import { useModalStore } from "@/storeZ";

export const setBackgroundColor = (theme: string) => {
	if (theme === "light") {
		return "hover:bg-gray-50";
	}
	return "hover:bg-accent";
};

const DesignationsContainer = () => {
	const { newIssueData, setNewIssueData } = useModalStore((state) => state);

	return (
		<>
			<div className="flex flex-row flex-start items-center space-between">
				<StatusDropdownButton
					newIssueData={newIssueData}
					setNewIssueData={setNewIssueData}
				/>
				<PriorityButton
					newIssueData={newIssueData}
					setNewIssueData={setNewIssueData}
				/>
				<LabelDropdownButton
					newIssueData={newIssueData}
					setNewIssueData={setNewIssueData}
				/>
				<DateButton
					newIssueData={newIssueData}
					setNewIssueData={setNewIssueData}
				/>
				<EffortEstimateButton
					newIssueData={newIssueData}
					setNewIssueData={setNewIssueData}
				/>
			</div>
		</>
	);
};

export default DesignationsContainer;
