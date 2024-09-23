import type React from "react";
import TopNavBarDisplay from "@/components/DisplaySettings";
import FilterDropDown from "@/components/FilterDropdowns";
import { MobileMenuSheetTrigger } from "../MobileNav";

const TopNavBar: React.FC = () => {
	return (
		<div className="flex flex-col flex-none justify-start items-start">
			<div className="flex gap-4 items-center mb-4 py-4 border-b border-border w-full">
				<MobileMenuSheetTrigger />
				<h1 className="text-xl font-bold">All Issues</h1>
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
