import type { Task, SavedFilter as SavedFilterType } from "@squared/db";
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
