import React, { useEffect, useState } from "react";
import { useFilterStore } from "@/storeZ";
import type { TaskFilter } from "@/storeZ/filters";
import { useToast } from "../ui/use-toast";
import { Button } from "../ui/button";

const FiltersPage = () => {
	const [userId, setUserId] = useState<string>("");
	const {
		currentFilter,
		deleteFilter,
		saveFilter,
		removeFilter,
		getSavedFilters,
		savedFilters,
	} = useFilterStore((state) => state);
	const { toast } = useToast();

	// Load saved filters when the page loads
	useEffect(() => {
		async function fetchFilters() {
			await getSavedFilters(userId);
		}

		if (userId) {
			fetchFilters();
		}
	}, [userId]);

	// Handler to save the current filter
	const handleSaveFilter = async () => {
		if (currentFilter) {
			const response = await saveFilter(userId, currentFilter);
			return toast(response);
		}
	};

	// Handler to delete a filter
	const handleDeleteFilter = async (filterId: string) => {
		const response = await deleteFilter(filterId);
		return toast(response);
	};

	// Render the list of saved filters and control actions
	return (
		<div>
			<h1>Saved Filters</h1>

			{/* List of saved filters */}
			<ul>
				{savedFilters.map((filter) => (
					<li key={filter.id}>
						Filter ID: {filter.id}, Logic: {filter.logic}
						<Button
							variant={"destructive"}
							onClick={() => handleDeleteFilter(filter.id || "")}
						>
							Delete
						</Button>
					</li>
				))}
			</ul>

			{/* Current filter actions */}
			<div>
				<h2>Current Filter</h2>
				{currentFilter ? (
					<>
						<p>
							Logic: {currentFilter.logic} | Conditions:{" "}
							{currentFilter.conditions.length}
						</p>
						<Button onClick={handleSaveFilter}>Save Filter</Button>
						<Button variant={"destructive"} onClick={removeFilter}>
							Remove Filter
						</Button>
					</>
				) : (
					<p>No current filter applied</p>
				)}
			</div>
		</div>
	);
};

export default FiltersPage;
