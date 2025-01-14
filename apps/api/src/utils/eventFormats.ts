import { Priority, Status } from "@squared/db";
export function formatStatus(value: string) {
	switch (value) {
		case Status.backlog:
			return "Backlog";
		case Status.todo:
			return "To Do";
		case Status.inProgress:
			return "In Progress";
		case Status.inReview:
			return "In Review";
		case Status.done:
			return "Done";
		case Status.canceled:
			return "Canceled";
		default:
			return value;
	}
}
export function formatPriority(value: string) {
	switch (value) {
		case Priority.low:
			return "Low";
		case Priority.medium:
			return "Medium";
		case Priority.high:
			return "High";
		case Priority.urgent:
			return "Urgent";
		case Priority.noPriority:
			return "No Priority";
		default:
			return value;
	}
}
