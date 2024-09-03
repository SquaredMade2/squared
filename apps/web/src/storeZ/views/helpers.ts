import type { Task } from "@repo/db";
import type { FilterCondition } from "./interfaces";

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
			return (
				typeof taskValue === "number" &&
				typeof condition.value === "number" &&
				taskValue > condition.value
			);
		case "lessThan":
			return (
				typeof taskValue === "number" &&
				typeof condition.value === "number" &&
				taskValue < condition.value
			);
		case "arrayIncludesAll":
			return (
				Array.isArray(taskValue) &&
				Array.isArray(condition.value) &&
				condition.value.every((val) => taskValue.includes(val))
			);
		case "arrayIncludesAny":
			return (
				Array.isArray(taskValue) &&
				Array.isArray(condition.value) &&
				condition.value.some((val) => taskValue.includes(val))
			);
		default:
			return false;
	}
}
