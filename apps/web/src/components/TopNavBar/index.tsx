"use client";

import { useState } from "react";
import TopNavBarDisplay from "@/components/DisplaySettings";
import FilterDropDown from "@/components/FilterDropdowns";
import { SaveFilterForm } from "@/components/FilterDropdowns/SaveFilterForm";
import { MobileMenuSheetTrigger } from "../MobileNav";
import { Button } from "@/components/ui/button";
import { useFilterStore } from "@/store";
import { usePathname } from "next/navigation";

const TopNavBar = ({ pageTitle }: { pageTitle: string }) => {
	const [showSaveForm, setShowSaveForm] = useState(false);
	const { currentFilters, clearFilter } = useFilterStore((state) => state);
	const pathname = usePathname();

	return (
		<div className="flex flex-col flex-none justify-start items-start">
			<div className="flex gap-4 items-center mb-4 py-4 border-b border-border w-full">
				<MobileMenuSheetTrigger />
				<h1 className="text-xl font-bold">{pageTitle}</h1>
			</div>
			<div className="flex w-full justify-between">
				<div className="flex gap-3 mb-4">
					<FilterDropDown />
				</div>
				<div className="flex gap-2">
					<TopNavBarDisplay />
					{currentFilters.length > 0 &&
						!showSaveForm &&
						!pathname.includes("views") && (
							<div className="gap-2 flex">
								<Button variant="outline" onClick={clearFilter} size="sm">
									Cancel
								</Button>
								<Button onClick={() => setShowSaveForm(true)} size="sm">
									Save
								</Button>
							</div>
						)}
				</div>
			</div>
			{showSaveForm && (
				<div className="w-full mt-4">
					<SaveFilterForm onCancel={() => setShowSaveForm(false)} />
				</div>
			)}
		</div>
	);
};

export default TopNavBar;
