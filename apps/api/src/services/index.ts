import { createDb } from "@squaredmade/db";
import config from "@/config";
import { createAuthRpcHandler } from "./auth";
import { AuthService } from "./auth/auth-service";
import { createCommentRpcHandler } from "./comments";
import { CommentService } from "./comments/comment-service";
import { createEventRpcHandler, EventService } from "./events";
import { createFilterRpcHandler, FilterService } from "./filters";
import { createGithubRpcHandler } from "./github";
import { GithubService } from "./github/github-service";
import { createSprintRpcHandler, SprintService } from "./sprints";
import { createTaskRpcHandler, TaskService } from "./tasks";
import { createTeamRpcHandler, TeamService } from "./teams";
import { createUserRpcHandler } from "./users";
import { UserService } from "./users/user-service";
import { createWorkspaceRpcHandler, WorkspaceService } from "./workspaces";

const db = createDb({
	databaseUrl: config.databaseUrl,
});

const clerkSecret = config.clerkSecret;

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
	task,
	team,
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
