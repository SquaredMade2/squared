import type { Priority, Status } from "@repo/db";

export const statusOptions: Status[] = [
	"backlog",
	"todo",
	"inProgress",
	"done",
	"canceled",
	"duplicate",
];

export const priorityOptions: Priority[] = [
	"noPriority",
	"urgent",
	"high",
	"medium",
	"low",
];

export const effortEstimateOptions = [
	"1 - Very quick delivery",
	"2 - Quick delivery & minimal complexity",
	"3 - Quick delivery & some complexity",
	"5 - Moderate delivery & complexity",
	"8 - Moderate delivery & high complexity",
	"13 - Longer delivery & higher complexity",
	"21 - Longest delivery & highest complexity",
];

export const complexityScale = [
	"Minutes",
	"1 Hour",
	"Hours",
	"1 Day",
	"1 Week",
	"Weeks",
	"Months",
];
