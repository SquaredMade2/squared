import {
	createRpcHandler,
	createSchema,
	createServiceSchema,
} from "@squared/rpc";
import { z } from "zod";
import {
	labelSchema,
	workspaceLabelSchema,
	workspaceRoleEnum,
} from "../schema";
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
		output: workspaceLabelSchema,
	},
	getWorkspace: {
		input: z.object({
			workspaceId: z.string(),
		}),
		output: workspaceLabelSchema.nullable(),
	},
	getWorkspaceByUrl: {
		input: z.object({
			url: z.string(),
		}),
		output: workspaceLabelSchema.nullable(),
	},
	updateWorkspace: {
		input: z.object({
			workspaceId: z.string(),
			workspace: workspaceParamsSchema,
		}),
		output: workspaceLabelSchema,
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
		output: z.array(workspaceLabelSchema),
	},
	joinWorkspace: {
		input: z.object({
			token: z.string(),
			userId: z.string(),
			role: workspaceRoleEnum.optional(),
		}),
		output: workspaceLabelSchema.nullable(),
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
			email: z.union([z.string(), z.array(z.string())]),
		}),
		output: z.object({ success: z.boolean() }),
	},
	getWorkspaceLabels: {
		input: z.object({ workspaceId: z.string() }),
		output: labelSchema.array(),
	},
	deleteWorkspaceLabel: {
		input: z.object({ workspaceId: z.string(), labelName: z.string() }),
		output: z.object({ success: z.boolean() }),
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
		getWorkspaceLabels: (input) => workspaceService.getWorkspaceLabels(input),
		deleteWorkspaceLabel: (input) =>
			workspaceService.deleteWorkspaceLabel(input),
	});

export { WorkspaceService } from "./workspace-service";
