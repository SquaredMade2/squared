import { Priority, Status, type Task, type User } from "@squaredmade/db";
import type { TaskOrder } from "@/store/views";

const compareNullableStrings = (a: string | null, b: string | null): number => {
	if (!(a || b)) return 0;
	if (!a) return 1;
	if (!b) return -1;
	return a.localeCompare(b);
};

const compareNullableNumbers = (a: number | null, b: number | null): number => {
	if (a === null && b === null) return 0;
	if (a === null) return -1;
	if (b === null) return 1;
	return a - b;
};

const compareNullableDates = (a: Date | null, b: Date | null): number => {
	if (a === null && b === null) return 0;
	if (a === null) return -1;
	if (b === null) return 1;
	return new Date(a).getTime() - new Date(b).getTime();
};

const priorityOrder = [
	Priority.noPriority,
	Priority.low,
	Priority.medium,
	Priority.high,
	Priority.urgent,
];

const statusOrder = [
	Status.backlog,
	Status.todo,
	Status.inProgress,
	Status.inReview,
	Status.done,
	Status.canceled,
	Status.duplicated,
	Status.archived,
];

export const orderTasks = (
	tasks: Task[],
	users: User[],
	orderBy: TaskOrder,
	orderAscending: boolean,
) => {
	return tasks.sort((a, b) => {
		let comparison = 0;

		switch (orderBy) {
			case "title":
				comparison = a.title.localeCompare(b.title);
				break;
			case "status":
				comparison =
					statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
				break;
			case "priority":
				comparison =
					priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority);
				break;
			case "assignee": {
				const aAssignee =
					users.find((u) => u.externalId === a.assigneeId)?.name ?? null;
				const bAssignee =
					users.find((u) => u.externalId === b.assigneeId)?.name ?? null;
				comparison = compareNullableStrings(aAssignee, bAssignee);
				break;
			}
			case "effort":
				comparison = compareNullableNumbers(a.effortEstimate, b.effortEstimate);
				break;
			case "dueDate":
				comparison = compareNullableDates(a.dueDate, b.dueDate);
				break;
			case "updated":
				comparison =
					new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
				break;
			case "created":
				comparison =
					new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime();
				break;
			default:
				break;
		}

		return orderAscending ? comparison : -comparison;
	});
};
