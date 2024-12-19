import {
	createRpcHandler,
	createSchema,
	createServiceSchema,
} from "@squared/rpc";
import { z } from "zod";
import { workspaceLabelSchema } from "../schema";
import type { WorkspaceParams, WorkspaceRpc } from "./types";

const workspaceParamsSchema = createSchema<WorkspaceParams>()(
	z.object({
		url: z.string(),
		name: z.string(),
	}),
).strict();

export const workspaceRpcSchema = createServiceSchema<WorkspaceRpc>()({
	createWorkspace: {
		input: z.object({
			userId: z.string(),
			workspace: workspaceParamsSchema,
		}).strict(),
		output: workspaceLabelSchema,
	},
	getWorkspace: {
		input: z.object({
			workspaceId: z.string(),
		}).strict(),
		output: workspaceLabelSchema.nullable(),
	},
	getWorkspaceByUrl: {
		input: z.object({
			url: z.string(),
		}).strict(),
		output: workspaceLabelSchema.nullable(),
	},
	updateWorkspace: {
		input: z.object({
			workspaceId: z.string(),
			workspace: workspaceParamsSchema,
		}).strict(),
		output: workspaceLabelSchema,
	},
	deleteWorkspace: {
		input: z.object({
			workspaceId: z.string(),
		}).strict(),
		output: z.void(),
	},
	getUserWorkspaces: {
		input: z.object({
			userId: z.string(),
		}).strict(),
		output: z.array(workspaceLabelSchema),
	},
	joinWorkspace: {
		input: z.object({
			token: z.string(),
			userId: z.string(),
		}).strict(),
		output: workspaceLabelSchema.nullable(),
	},
	removeUserFromWorkspace: {
		input: z.object({
			workspaceId: z.string(),
			userId: z.string(),
		}).strict(),
		output: z.void(),
	},
	inviteToWorkspace: {
		input: z.object({
			workspaceId: z.string(),
			email: z.union([z.string(), z.array(z.string())]),
		}).strict(),
		output: z.void(),
	},
});

export type WorkspaceRpcSchema = typeof workspaceRpcSchema;

export const createWorkspaceRpcHandler = (workspaceService: WorkspaceRpc) =>
	createRpcHandler("workspace", workspaceRpcSchema, {
		createWorkspace: (input) => workspaceService.createWorkspace(input),
		getWorkspace: (input) => workspaceService.getWorkspace(input),
		getWorkspaceByUrl: (input) => workspaceService.getWorkspaceByUrl(input),
		updateWorkspace: (input) => workspaceService.updateWorkspace(input),
		deleteWorkspace: (input) => workspaceService.deleteWorkspace(input),
		getUserWorkspaces: (input) => workspaceService.getUserWorkspaces(input),
		joinWorkspace: (input) => workspaceService.joinWorkspace(input),
		removeUserFromWorkspace: (input) =>
			workspaceService.removeUserFromWorkspace(input),
		inviteToWorkspace: (input) => workspaceService.inviteToWorkspace(input),
	});

export { WorkspaceService } from "./workspace-service";
