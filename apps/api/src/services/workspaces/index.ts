import {
	createRpcHandler,
	createSchema,
	createServiceSchema,
} from "@squared/rpc";
import { z } from "zod";
import { workspaceRoleEnum, workspaceSchema } from "../schema";
import type { WorkspaceParams, WorkspaceRpc } from "./types";

const workspaceParamsSchema = createSchema<WorkspaceParams>()(
	z.object({
		url: z.string(),
		name: z.string(),
		defaultView: z.string().nullable(),
	}),
);

export const workspaceRpcSchema = createServiceSchema<WorkspaceRpc>()({
	createWorkspace: {
		input: z.object({
			userId: z.string(),
			workspace: z.object({
				url: z.string(),
				name: z.string(),
			}),
		}),
		output: workspaceSchema,
	},
	getWorkspace: {
		input: z.object({
			workspaceId: z.string(),
		}),
		output: workspaceSchema.nullable(),
	},
	getWorkspaceByUrl: {
		input: z.object({
			url: z.string(),
		}),
		output: workspaceSchema.nullable(),
	},
	updateWorkspace: {
		input: z.object({
			workspaceId: z.string(),
			workspace: workspaceParamsSchema,
		}),
		output: workspaceSchema,
	},
	deleteWorkspace: {
		input: z.object({
			workspaceId: z.string(),
		}),
		output: z.void(),
	},
	getUserWorkspaces: {
		input: z.object({
			userId: z.string(),
		}),
		output: z.array(workspaceSchema),
	},
	joinWorkspace: {
		input: z.object({
			token: z.string(),
			userId: z.string(),
			role: workspaceRoleEnum.optional(),
		}),
		output: workspaceSchema.nullable(),
	},
	removeUserFromWorkspace: {
		input: z.object({
			workspaceId: z.string(),
			userId: z.string(),
		}),
		output: z.object({ success: z.boolean() }),
	},
	inviteToWorkspace: {
		input: z.object({
			workspaceId: z.string(),
			email: z.array(z.string()),
			userId: z.string(),
			slug: z.string(),
		}),
		output: z.object({ success: z.boolean() }),
	},
	getTakenWorkspaceUrls: {
		input: z.undefined(),
		output: z.array(z.string()),
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
		getTakenWorkspaceUrls: () => workspaceService.getTakenWorkspaceUrls(),
	});

export { WorkspaceService } from "./workspace-service";
