import { pgEnum } from "drizzle-orm/pg-core";
import type { Task } from "./schema";

export const activityType = pgEnum("ActivityType", ["TASK_EVENT", "COMMIT"]);
export const effortType = pgEnum("Effort", [
	"LINEAR",
	"FIBONACCI",
	"EXPONENTIAL",
]);
export const notificationType = pgEnum("NotificationType", [
	"ASSIGNED",
	"PARTICIPATING",
	"MENTIONED",
	"CREATED",
]);
export const priorityType = pgEnum("Priority", [
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
export const sprintStatusType = pgEnum("SprintStatus", [
	"PLANNED",
	"ACTIVE",
	"COMPLETED",
]);
export const statusType = pgEnum("Status", [
	"backlog",
	"todo",
	"inProgress",
	"inReview",
	"done",
	"canceled",
	"duplicated",
	"archived",
]);

export const workspaceRoleType = pgEnum("WorkspaceRole", [
	"owner",
	"admin",
	"member",
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
export const Effort = objEnum(effortType.enumValues);
export type Effort = (typeof effortType.enumValues)[number];
export const NotificationType = objEnum(notificationType.enumValues);
export type NotificationType = (typeof notificationType.enumValues)[number];
export const Priority = objEnum(priorityType.enumValues);
export type Priority = (typeof priorityType.enumValues)[number];
export const RetrospectiveItemType = objEnum(retrospectiveItemType.enumValues);
export type RetrospectiveItemType =
	(typeof retrospectiveItemType.enumValues)[number];
export const WorkspaceRole = objEnum(workspaceRoleType.enumValues);
export type WorkspaceRole = (typeof workspaceRoleType.enumValues)[number];
export const SavedFilterType = objEnum(savedFilterType.enumValues);
export type SavedFilterType = (typeof savedFilterType.enumValues)[number];
export const SprintStatus = objEnum(sprintStatusType.enumValues);
export type SprintStatus = (typeof sprintStatusType.enumValues)[number];
export const Status = objEnum(statusType.enumValues);
export type Status = (typeof statusType.enumValues)[number];
