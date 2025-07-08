import { auth } from "@clerk/nextjs/server";
import { env } from "hono/adapter";
import { HTTPException } from "hono/http-exception";
import { jstack } from "jstack";
import type { config as configEnv } from "@/config";
import { AuthService } from "@/gen/rpc/auth";
import { CommentService } from "@/gen/rpc/comment";
import { EventService } from "@/gen/rpc/event";
import { FilterService } from "@/gen/rpc/filter";
import { GithubService } from "@/gen/rpc/github";
import { SprintService } from "@/gen/rpc/sprint";
import { TaskService } from "@/gen/rpc/task";
import { TeamService } from "@/gen/rpc/team";
import { UserService } from "@/gen/rpc/user";
import { WorkspaceService } from "@/gen/rpc/workspace";

interface Env {
	// biome-ignore lint/style/useNamingConvention: These are expected by hono
	Bindings: typeof configEnv;
}

export const j = jstack.init<Env>();

/**
 * You can remove this if you don't like it, but caching can massively speed up your database queries.
 */

const extendedContextMiddleware = j.middleware(async ({ c, next }) => {
	const variables = env(c);
	const serverUrl = variables.NEXT_PUBLIC_SERVER;

	const authService = new AuthService(serverUrl);

	// Whatever you put inside of `next` is accessible to all following middlewares
	return await next({ authService });
});

const authMiddleware = j.middleware(async ({ next }) => {
	// Get the current user to add it to the context
	const { userId, orgId } = await auth();
	if (!userId) throw new HTTPException(401, { message: "Unauthorized" });

	return await next({
		orgId,
		userId,
	});
});

const serviceMiddleware = j.middleware(async ({ c, next }) => {
	const variables = env(c);
	const serverUrl = variables.NEXT_PUBLIC_SERVER;

	const commentService = new CommentService(serverUrl);
	const eventService = new EventService(serverUrl);
	const filterService = new FilterService(serverUrl);
	const githubService = new GithubService(serverUrl);
	const sprintService = new SprintService(serverUrl);
	const taskService = new TaskService(serverUrl);
	const teamService = new TeamService(serverUrl);
	const userService = new UserService(serverUrl);
	const workspaceService = new WorkspaceService(serverUrl);
	return await next({
		commentService,
		eventService,
		filterService,
		githubService,
		sprintService,
		taskService,
		teamService,
		userService,
		workspaceService,
	});
});

const workspaceMiddleware = j.middleware(async ({ next }) => {
	// Get the current workspace to add it to the context
	const { orgId } = await auth();
	if (!orgId)
		throw new HTTPException(401, { message: "Workspace not available" });

	return await next({
		workspaceId: orgId,
	});
});

/**
 * Public (unauthenticated) procedures
 *
 * This is the base piece you use to build new queries and mutations on your API.
 */
export const baseProcedure = j.procedure;
export const publicProcedure = baseProcedure
	.use(extendedContextMiddleware)
	.use(serviceMiddleware);
export const privateProcedure = publicProcedure
	.use(authMiddleware)
	.use(serviceMiddleware);
export const workspaceProcedure = privateProcedure.use(workspaceMiddleware);
