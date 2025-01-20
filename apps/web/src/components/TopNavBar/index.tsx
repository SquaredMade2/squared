"use client";

import TopNavBarDisplay from "@/components/DisplaySettings";
import FilterDropDown from "@/components/FilterDropdowns";
import { SaveFilterForm } from "@/components/FilterDropdowns/SaveFilterForm";
import { useFilterStore } from "@/store";
import { Button } from "@squared/ui/button";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const TopNavBar = ({
	pageTitle,
}: { pageTitle?: string; sprintId?: string }) => {
	const { currentFilters, clearFilter, showSaveForm, setShowSaveForm } =
		useFilterStore((state) => state);
	const pathname = usePathname();
	const [createNewFilter, setCreateNewFilter] = useState(false);

	useEffect(() => {
		if (currentFilters.length === 0) {
			setShowSaveForm(false);
		}
	}, [currentFilters]);

	return (
		<div className="flex flex-col flex-none justify-start items-start">
			<div className="flex gap-4 items-center mb-4 py-4 border-b border-border w-full">
				<h1 className="text-xl font-bold ml-8">{pageTitle ?? "Tasks Page"}</h1>
			</div>
			<div className="flex w-full justify-between">
				<div className="flex gap-3 mb-4">
					<FilterDropDown />
				</div>
				<div className="flex gap-2">
					<TopNavBarDisplay />
					{currentFilters.length > 0 && !showSaveForm && (
						<div className="gap-2 flex">
							{pathname.includes("/views") ? (
								<>
									<Button
										variant="outline"
										onClick={() => {
											setShowSaveForm(true);
											setCreateNewFilter(false);
										}}
										size="sm"
									>
										Edit
									</Button>
									<Button
										onClick={() => {
											setShowSaveForm(true);
											setCreateNewFilter(true);
										}}
										size="sm"
									>
										Save New Filter
									</Button>
								</>
							) : (
								<>
									<Button variant="outline" onClick={clearFilter} size="sm">
										Cancel
									</Button>
									<Button
										onClick={() => {
											setShowSaveForm(true);
											setCreateNewFilter(true);
										}}
										size="sm"
									>
										Save
									</Button>
								</>
							)}
						</div>
					)}
				</div>
			</div>
			{showSaveForm && (
				<div className="w-full mt-4">
					<SaveFilterForm
						onCancel={() => setShowSaveForm(false)}
						type={createNewFilter ? "new" : "edit"}
					/>
				</div>
			)}
		</div>
	);
};

export default TopNavBar;
