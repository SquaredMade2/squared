import type { Priority, Status } from "@repo/db";
// import { useTeamStore } from "@/store";

// const { currentTeam } = useTeamStore((state) => state);
// const effortType = currentTeam?.effort;

export const statusOptions: Status[] = [
	"backlog",
	"todo",
	"inProgress",
	"inReview",
	"done",
	"canceled",
];

export const priorityOptions: Priority[] = [
	"noPriority",
	"urgent",
	"high",
	"medium",
	"low",
];

// export const effortEstimateOptions = [
// 	"1 - Very quick delivery",
// 	"2 - Quick delivery & minimal complexity",
// 	"3 - Moderate delivery & complexity",
// 	"4 - Longer delivery & higher complexity",
// 	"5 - Longest delivery & highest complexity",
// ];

export const effortEstimateOptions = (effortType: string | undefined) => {
	switch (effortType) {
		case "EXPONENTIAL":
			return [
				{ text: "1 - Very quick delivery", value: 1 },
				{ text: "2 - Quick delivery & minimal complexity", value: 2 },
				{ text: "4 - Moderate delivery & complexity", value: 3 },
				{ text: "8 - Longer delivery & higher complexity", value: 4 },
				{ text: "16 - Longest delivery & highest complexity", value: 5 },
			];
		case "FIBONACCI":
			return [
				{ text: "1 - Very quick delivery", value: 1 },
				{ text: "2 - Quick delivery & minimal complexity", value: 2 },
				{ text: "3 - Moderate delivery & complexity", value: 3 },
				{ text: "5 - Longer delivery & higher complexity", value: 4 },
				{ text: "8 - Longest delivery & highest complexity", value: 5 },
			];
		default:
			return [
				{ text: "1 - Very quick delivery", value: 1 },
				{ text: "2 - Quick delivery & minimal complexity", value: 2 },
				{ text: "3 - Moderate delivery & complexity", value: 3 },
				{ text: "4 - Longer delivery & higher complexity", value: 4 },
				{ text: "5 - Longest delivery & highest complexity", value: 5 },
			];
	}
};

export const complexityScale = [
	"Minutes",
	"1 Hour",
	"Hours",
	"1 Day",
	"1 Week",
	"Weeks",
	"Months",
];
