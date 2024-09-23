import type React from "react";
import TopNavBarDisplay from "@/components/DisplaySettings";
import FilterDropDown from "@/components/FilterDropdowns";
import ToggleNavBar from "../ToggleNavBar";

const TopNavBar: React.FC = () => {
	return (
		<div className="flex flex-col flex-none justify-start items-start mt-4">
			<div className="w-full flex items-center">
				<ToggleNavBar />
				<div className="md:hidden">All Issues</div>
			</div>
			<div className="flex w-full justify-between">
				<div className="flex gap-3 mb-4">
					<FilterDropDown />
				</div>
				<TopNavBarDisplay />
			</div>
		</div>
	);
};

export default TopNavBar;
