import "./polyfills.js";
import { j } from "./jstack";
import { authRouter } from "./routers/auth-router";
import { commentRouter } from "./routers/comment-router";
import { eventRouter } from "./routers/event-router";
import { filterRouter } from "./routers/filter-router";
import { githubRouter } from "./routers/github-router";
import { notificationRouter } from "./routers/notification-router";
import { sprintRouter } from "./routers/sprint-router";
import { taskRouter } from "./routers/task-router";
import { teamRouter } from "./routers/team-router";
import { userRouter } from "./routers/user-router";
import { workspaceRouter } from "./routers/workspace-router";

/**
 * This is your base API.
 * Here, you can handle errors, not-found responses, cors and more.
 *
 * @see https://jstack.app/docs/backend/app-router
 */
const api = j
	.router()
	.basePath("/api")
	.use(j.defaults.cors)
	.onError(j.defaults.errorHandler);
/**
 * This is the primary router for your server.
 *
 * All routers added in /server/routers should be manually added here.
 */
const appRouter = j.mergeRouters(api, {
	auth: authRouter,
	comment: commentRouter,
	event: eventRouter,
	filter: filterRouter,
	github: githubRouter,
	notification: notificationRouter,
	sprint: sprintRouter,
	team: teamRouter,
	task: taskRouter,
	user: userRouter,
	workspace: workspaceRouter,
});

export type AppRouter = typeof appRouter;

export default appRouter;
