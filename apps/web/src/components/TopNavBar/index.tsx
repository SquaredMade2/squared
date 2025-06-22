"use client";

import { Button } from "@squaredmade/ui/button";
import { Input } from "@squaredmade/ui/input";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import TopNavBarDisplay from "@/components/DisplaySettings";
import FilterDropDown from "@/components/FilterDropdowns";
import { SaveFilterForm } from "@/components/FilterDropdowns/save-filter-form";
import { useFilterStore } from "@/store";
import { useDebounce } from "@/utils/useDebounce";

const TopNavBar = ({
	pageTitle,
}: {
	pageTitle?: string;
	sprintId?: string;
}) => {
	const {
		currentFilters,
		clearFilter,
		showSaveForm,
		setShowSaveForm,
		setSearchFilter,
	} = useFilterStore((state) => state);
	const pathname = usePathname();
	const [createNewFilter, setCreateNewFilter] = useState(false);
	const [search, setSearch] = useState("");
	const debouncedSearch = useDebounce(search, 500);

	useEffect(() => {
		setSearchFilter(debouncedSearch);
	}, [debouncedSearch, setSearchFilter]);

	useEffect(() => {
		if (currentFilters.length === 0) {
			setShowSaveForm(false);
		}
	}, [currentFilters]);

	return (
		<div className="flex flex-none flex-col items-start justify-start">
			<div className="mb-4 flex w-full items-center gap-4 border-border border-b py-4">
				<h1 className="ml-8 font-bold text-xl">{pageTitle ?? "Tasks Page"}</h1>
			</div>
			<div className="flex w-full justify-between">
				<div className="mb-4 flex gap-3">
					<FilterDropDown />
					<Input
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search Tasks"
					/>
				</div>
				<div className="flex gap-2">
					<TopNavBarDisplay />
					{currentFilters.length > 0 && !showSaveForm && (
						<div className="flex gap-2">
							{pathname.includes("/views") ? (
								<>
									<Button
										onClick={() => {
											setShowSaveForm(true);
											setCreateNewFilter(false);
										}}
										size="sm"
										variant="outline"
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
									<Button onClick={clearFilter} size="sm" variant="outline">
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
				<div className="mt-4 w-full">
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
