import { AuthService } from "@/gen/rpc/auth";
import { CommentService } from "@/gen/rpc/comment";
import { EventService } from "@/gen/rpc/event";
import { FilterService } from "@/gen/rpc/filter";
import { SprintService } from "@/gen/rpc/sprint";
import { TaskService } from "@/gen/rpc/task";
import { TeamService } from "@/gen/rpc/team";
import { UserService } from "@/gen/rpc/user";
import { WorkspaceService } from "@/gen/rpc/workspace";
import { auth, currentUser } from "@clerk/nextjs/server";
import { env } from "hono/adapter";
import { HTTPException } from "hono/http-exception";
// import { HTTPException } from "hono/http-exception";
import { j } from "./__internals/j";

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

const authMiddleware = j.middleware(async ({ c, next }) => {
	// Get the current user to add it to the context
	const clerkUser = await currentUser();
	const { orgId } = await auth();
	if (!clerkUser) throw new HTTPException(401, { message: "Unauthorized" });

	const variables = env(c);
	const serverUrl = variables.NEXT_PUBLIC_SERVER;

	const authService = new AuthService(serverUrl);
	const commentService = new CommentService(serverUrl);
	const eventService = new EventService(serverUrl);
	const filterService = new FilterService(serverUrl);
	const sprintService = new SprintService(serverUrl);
	const taskService = new TaskService(serverUrl);
	const teamService = new TeamService(serverUrl);
	const userService = new UserService(serverUrl);
	const workspaceService = new WorkspaceService(serverUrl);

	if (!clerkUser) throw new HTTPException(401, { message: "Unauthorized" });

	return await next({
		userId: clerkUser.id,
		workspaceId: orgId,
		authService,
		commentService,
		eventService,
		filterService,
		sprintService,
		taskService,
		teamService,
		userService,
		workspaceService,
	});
});

/**
 * Public (unauthenticated) procedures
 *
 * This is the base piece you use to build new queries and mutations on your API.
 */
export const baseProcedure = j.procedure;
export const publicProcedure = baseProcedure.use(extendedContextMiddleware);
export const privateProcedure = publicProcedure.use(authMiddleware);
