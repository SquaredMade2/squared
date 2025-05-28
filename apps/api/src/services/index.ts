import { j } from "@/utils/sqStack";
import { cors, errorHandler } from "@squaredmade/server/middleware";
import { authService } from "./auth-service";
import { commentService } from "./comment-service";
import { eventService } from "./event-service";
import { filterService } from "./filter-service";
import { githubService } from "./github-service";
import { sprintService } from "./sprint-service";
import { taskService } from "./task-service";
import { teamService } from "./teams-service";
import { userService } from "./user-service";
import { workspaceService } from "./workspace-service";

const api = j.router().basePath("/api").use(cors).onError(errorHandler);

const appRouter = j.mergeRouters(api, {
	auth: authService,
	comment: commentService,
	event: eventService,
	filter: filterService,
	github: githubService,
	sprint: sprintService,
	task: taskService,
	team: teamService,
	users: userService,
	workspace: workspaceService,
});

export type AppRouter = typeof appRouter;

export default appRouter;
