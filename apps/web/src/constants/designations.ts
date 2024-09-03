import type { Label, Priority } from "@repo/db";

export const statusOptions = [
	"Backlog",
	"Todo",
	"In Progress",
	"Done",
	"Canceled",
	"Duplicate",
];

export const priorityOptions: Priority[] = [
	"noPriority",
	"urgent",
	"high",
	"medium",
	"low",
];

export const labelOptions: Label[] = [
	"Bug",
	"Feature",
	"Improvement",
	"Red",
	"Test",
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
