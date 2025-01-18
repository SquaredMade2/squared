import { pgEnum } from "drizzle-orm/pg-core";
import type { Task } from "./schema";

export const activityType = pgEnum("ActivityType", ["TASK_EVENT", "COMMIT"]);
export const effort = pgEnum("Effort", ["LINEAR", "FIBONACCI", "EXPONENTIAL"]);
export const notificationType = pgEnum("NotificationType", [
	"ASSIGNED",
	"PARTICIPATING",
	"MENTIONED",
	"CREATED",
]);
export const priority = pgEnum("Priority", [
	"noPriority",
	"urgent",
	"high",
	"medium",
	"low",
]);
export const retrospectiveItemType = pgEnum("RetrospectiveItemType", [
	"wentWell",
	"toImprove",
	"actionItems",
]);
export const savedFilterType = pgEnum("SavedFilterType", ["TEAM", "WORKSPACE"]);
export const sprintStatus = pgEnum("SprintStatus", [
	"PLANNED",
	"ACTIVE",
	"COMPLETED",
]);
export const status = pgEnum("Status", [
	"backlog",
	"todo",
	"inProgress",
	"inReview",
	"done",
	"canceled",
	"archived",
]);

export type FilterValue =
	| string
	| number
	| Date
	| boolean
	| null
	| (string | null)[]
	| string[];

export type FilterCondition = {
	field: keyof Task;
	value: FilterValue;
	operator:
		| "equals"
		| "contains"
		| "greaterThan"
		| "lessThan"
		| "arrayIncludesAll"
		| "arrayIncludesAny";
};

function objEnum<T extends string>(enumValues: readonly T[]) {
	const enumObject = {} as { [K in T]: K };
	for (const enumValue of enumValues) {
		enumObject[enumValue] = enumValue;
	}
	return enumObject;
}

export const Activity = objEnum(activityType.enumValues);
export type Activity = (typeof activityType.enumValues)[number];
export const Effort = objEnum(effort.enumValues);
export type Effort = (typeof effort.enumValues)[number];
export const NotificationType = objEnum(notificationType.enumValues);
export type NotificationType = (typeof notificationType.enumValues)[number];
export const Priority = objEnum(priority.enumValues);
export type Priority = (typeof priority.enumValues)[number];
export const RetrospectiveItemType = objEnum(retrospectiveItemType.enumValues);
export type RetrospectiveItemType =
	(typeof retrospectiveItemType.enumValues)[number];
export const SavedFilterType = objEnum(savedFilterType.enumValues);
export type SavedFilterType = (typeof savedFilterType.enumValues)[number];
export const SprintStatus = objEnum(sprintStatus.enumValues);
export type SprintStatus = (typeof sprintStatus.enumValues)[number];
export const Status = objEnum(status.enumValues);
export type Status = (typeof status.enumValues)[number];
