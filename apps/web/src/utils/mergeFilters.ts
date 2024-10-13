import type { FilterCondition } from "@/store/filters";

export const mergeFilters = (
	newFilters: FilterCondition[],
	savedFilters: FilterCondition[],
) => {
	const filterMap = new Map<string, FilterCondition>();

	// Add existing filter conditions to the map
	if (savedFilters) {
		for (const condition of savedFilters) {
			filterMap.set(condition.field as string, condition);
		}
	}
	// Merge new filter conditions, replacing any existing fields
	for (const condition of newFilters) {
		filterMap.set(condition.field as string, condition);
	}

	// Convert the map back to an array of FilterCondition
	return Array.from(filterMap.values());
};
