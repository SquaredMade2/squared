import { Priority, Status } from "@squaredmade/db";
import { CompletedTaskPeriod } from "@/store/views";

export const statusOptions: Status[] = [
	Status.backlog,
	Status.todo,
	Status.inProgress,
	Status.inReview,
	Status.done,
	Status.canceled,
	Status.duplicated,
];

export const priorityOptions: Priority[] = [
	Priority.noPriority,
	Priority.urgent,
	Priority.high,
	Priority.medium,
	Priority.low,
];

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

export const CompletedTaskPeriodOptions: CompletedTaskPeriod[] = [
	CompletedTaskPeriod.All,
	CompletedTaskPeriod.PastDay,
	CompletedTaskPeriod.PastWeek,
	CompletedTaskPeriod.PastMonth,
	CompletedTaskPeriod.None,
];

export const LINK_EXPIRATION_TIMES = [
	"15m",
	"30m",
	"1h",
	"6h",
	"12h",
	"1d",
	"7d",
];
