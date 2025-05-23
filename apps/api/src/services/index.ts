import env from "@/env";
import { createDb } from "@squaredmade/db";
import { createAuthRpcHandler } from "./auth";
import { AuthService } from "./auth/auth-service";
import { CommentService } from "./comment-service";
import { createCommentRpcHandler } from "./comments";
import { EventService, createEventRpcHandler } from "./events";
import { FilterService, createFilterRpcHandler } from "./filters";
import { createGithubRpcHandler } from "./github";
import { GithubService } from "./github-service";
import { SprintService, createSprintRpcHandler } from "./sprints";
import { TaskService, createTaskRpcHandler } from "./tasks";
import { TeamService, createTeamRpcHandler } from "./teams";
import { createUserRpcHandler } from "./users";
import { UserService } from "./users/user-service";
import { WorkspaceService, createWorkspaceRpcHandler } from "./workspaces";

const db = createDb({
	databaseUrl: env.DATABASE_URL,
});

const clerkSecret = env.CLERK_SECRET;

const auth = new AuthService(db);
const comment = new CommentService(db);
const event = new EventService(db);
const filter = new FilterService(db);
const github = new GithubService(db);
const sprint = new SprintService(db);
const team = new TeamService(db);
const task = new TaskService(db, event);
const user = new UserService(db);
const workspace = new WorkspaceService(db, clerkSecret);

export const services = {
	auth,
	comment,
	event,
	filter,
	github,
	sprint,
	team,
	task,
	user,
	workspace,
};

export const rpcHandlers = {
	auth: createAuthRpcHandler(services.auth),
	comment: createCommentRpcHandler(services.comment),
	event: createEventRpcHandler(services.event),
	filter: createFilterRpcHandler(services.filter),
	github: createGithubRpcHandler(services.github),
	sprint: createSprintRpcHandler(services.sprint),
	task: createTaskRpcHandler(services.task),
	team: createTeamRpcHandler(services.team),
	user: createUserRpcHandler(services.user),
	workspace: createWorkspaceRpcHandler(services.workspace),
};

export type Services = typeof services;
export type RpcHandlers = typeof rpcHandlers;
