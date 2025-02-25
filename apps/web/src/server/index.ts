import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";
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

const app = new Hono().basePath("/api").use(cors());

/**
 * This is the primary router for your server.
 *
 * All routers added in /server/routers should be manually added here.
 */
const appRouter = app
	.route("/auth", authRouter)
	.route("/comment", commentRouter)
	.route("/event", eventRouter)
	.route("/filter", filterRouter)
	.route("/github", githubRouter)
	.route("/notification", notificationRouter)
	.route("/sprint", sprintRouter)
	.route("/team", teamRouter)
	.route("/task", taskRouter)
	.route("/user", userRouter)
	.route("/workspace", workspaceRouter);

// The handler Next.js uses to answer API requests
export const httpHandler = handle(app);

/**
 * (Optional)
 * Exporting our API here for easy deployment
 *
 * Run `npm run deploy` for one-click API deployment to Cloudflare's edge network
 */
export default app;

// export type definition of API
export type AppType = typeof appRouter;
