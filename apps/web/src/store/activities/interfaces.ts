// import type { Commit, TaskEvent, Prisma } from "@squared/db";

// export type ActivityState = {
// 	events: ActivityType[];
// };

// export type ActivityType = Prisma.ActivityGetPayload<{
// 	include: { taskEvent: true; commit: true };
// }>;

// type ActivityActions = {
// 	addTaskEvent: (
// 		event: TaskEvent,
// 		taskId: string,
// 		authorId: string,
// 	) => Promise<TaskEvent | null>;
// 	addCommitEvent: (
// 		event: Commit,
// 		taskId: string,
// 		authorId: string,
// 	) => Promise<Commit | null>;
// 	getTaskEvents: (taskId: string) => Promise<ActivityType[]>;
// };

// export type ActivityStore = ActivityState & ActivityActions;
