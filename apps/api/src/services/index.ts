import "dotenv/config";
import { PrismaClient } from "@squared/db";
import { createAuthRpcHandler } from "./auth";
import { AuthService } from "./auth/auth-service";
import { createCommentRpcHandler } from "./comments";
import { CommentService } from "./comments/comment-service";
import { EventService, createEventRpcHandler } from "./events";
import { SprintService, createSprintRpcHandler } from "./sprints";
import { TaskService, createTaskRpcHandler } from "./tasks";
import { TeamService, createTeamRpcHandler } from "./teams";
import { createUserRpcHandler } from "./users";
import { UserService } from "./users/user-service";
import { WorkspaceService, createWorkspaceRpcHandler } from "./workspaces";

const prisma = new PrismaClient({
	datasources: {
		db: {
			url: process.env.POSTGRES_PRISMA_URL,
		},
	},
});

const secret = process.env.JWT_SECRET;

const auth = new AuthService(prisma, secret);
const comment = new CommentService(prisma);
const event = new EventService(prisma);
const sprint = new SprintService(prisma);
const team = new TeamService(prisma);
const task = new TaskService(prisma);
const user = new UserService(prisma);
const workspace = new WorkspaceService(prisma, secret);

export const services = {
	auth,
	comment,
	event,
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
	sprint: createSprintRpcHandler(services.sprint),
	task: createTaskRpcHandler(services.task),
	team: createTeamRpcHandler(services.team),
	user: createUserRpcHandler(services.user),
	workspace: createWorkspaceRpcHandler(services.workspace),
};

export type Services = typeof services;
export type RpcHandlers = typeof rpcHandlers;
