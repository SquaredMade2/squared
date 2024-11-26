import type { SavedFilter as SavedFilterType, Task, User } from "@squared/db";
import type { FilterCondition, SavedFilter } from "./interfaces";

export function checkCondition(
	task: Task,
	condition: FilterCondition,
): boolean {
	const taskValue = task[condition.field];

	switch (condition.operator) {
		case "equals":
			return taskValue === condition.value;
		case "contains":
			return (
				typeof taskValue === "string" &&
				typeof condition.value === "string" &&
				taskValue.includes(condition.value)
			);
		case "greaterThan":
			if (taskValue instanceof Date || typeof taskValue === "string") {
				return new Date(taskValue) > new Date(condition.value as string);
			}
			return (
				typeof taskValue === "number" &&
				typeof condition.value === "number" &&
				taskValue > condition.value
			);
		case "lessThan":
			if (taskValue instanceof Date || typeof taskValue === "string") {
				return new Date(taskValue) < new Date(condition.value as string);
			}
			return (
				typeof taskValue === "number" &&
				typeof condition.value === "number" &&
				taskValue < condition.value
			);
		case "arrayIncludesAll":
			if (!Array.isArray(taskValue) || !Array.isArray(condition.value)) {
				return false;
			}
			return condition.value.every((val) =>
				taskValue.some(
					(item) =>
						(item === null && val === null) ||
						(item !== null &&
							val !== null &&
							item.toString() === val.toString()),
				),
			);
		case "arrayIncludesAny":
			if (Array.isArray(taskValue)) {
				return (
					Array.isArray(condition.value) &&
					condition.value.some((val) =>
						taskValue.some(
							(item) =>
								(item === null && val === null) ||
								(item !== null &&
									val !== null &&
									item.toString() === val.toString()),
						),
					)
				);
			}
			if (condition.field === "assigneeId") {
				return (
					Array.isArray(condition.value) &&
					condition.value.some(
						(val) =>
							(val === null && taskValue === null) ||
							(val !== null &&
								taskValue !== null &&
								val.toString() === taskValue.toString()),
					)
				);
			}
			return (
				Array.isArray(condition.value) &&
				condition.value.some(
					(val) =>
						(val === null && taskValue === null) ||
						(val !== null &&
							taskValue !== null &&
							val.toString() === taskValue.toString()),
				)
			);
		default:
			console.warn(`Unknown operator: ${condition.operator}`);
			return false;
	}
}

/**
 * Because there is no persisted store for assignees in the filter menu and the filter dropdown menu is destroyed whenever closed,
 * the default state of assignees is used whenever the dropdown is opened.
 *
 * This function allows selected assignees to be remembered throughout opening and closing of the filter menu, 
 * following in line with behaviors of other fields.
 */
export function getFilterAssignees(
	currentFilters: FilterCondition[],
	users: User[],
) {
	const assigneeFilter = currentFilters.find((f) => f.field === "assigneeId");
	if (!assigneeFilter) return [];

	// these values are an array of user ids, I really just have to do the array check thing
	// because filter values can be a union type so typescript will complain otherwise
	const filterValueArray = Array.isArray(assigneeFilter.value)
		? assigneeFilter.value
		: [assigneeFilter.value];

	const initialUsers = users.filter((u) => filterValueArray.includes(u.id));

	// the "unassigned" user is just a user who is null
	const hasUnassigned = filterValueArray.includes(null);
	return hasUnassigned ? [...initialUsers, null] : initialUsers;
}

export function parseFilter(newFilter: SavedFilterType): SavedFilter {
	const parsedFilter: SavedFilter = {
		...newFilter,
		filter:
			(newFilter.filter
				?.map((condition) =>
					typeof condition === "string"
						? (JSON.parse(condition) as FilterCondition)
						: condition,
				)
				.filter((condition) => condition !== null) as FilterCondition[]) || [],
	};

	return parsedFilter;
}
