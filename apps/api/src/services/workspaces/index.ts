import {
	createRpcHandler,
	createSchema,
	createServiceSchema,
} from "@squared/rpc";
import { z } from "zod";
import { labelSchema, workspaceRoleEnum, workspaceSchema } from "../schema";
import type {
	JoinWorkspaceParams,
	WorkspaceParams,
	WorkspaceRpc,
} from "./types";

const workspaceParamsSchema = createSchema<WorkspaceParams>()(
	z.object({
		url: z.string(),
		name: z.string(),
		defaultView: z.string().nullable(),
	}),
);

const joinWorkspaceParamsSchema = createSchema<JoinWorkspaceParams>()(
	z.object({
		user: z.object({
			id: z.string(),
			name: z.string(),
			email: z.string(),
		}),
		workspaceId: z.string(),
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
		input: joinWorkspaceParamsSchema,
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
	getWorkspaceLabels: {
		input: z.object({ workspaceId: z.string() }),
		output: labelSchema.array(),
	},
	createWorkspaceLabel: {
		input: z.object({ workspaceId: z.string(), label: labelSchema }),
		output: z.object({
			success: z.boolean(),
			labels: labelSchema.array().optional(),
		}),
	},
	updateWorkspaceLabel: {
		input: z.object({
			workspaceId: z.string(),
			labelName: z.string(),
			updatedLabel: labelSchema,
		}),
		output: z.object({
			success: z.boolean(),
			labels: labelSchema.array().optional(),
		}),
	},
	deleteWorkspaceLabel: {
		input: z.object({ workspaceId: z.string(), labelName: z.string() }),
		output: z.object({ success: z.boolean() }),
	},
	updateWorkspaceRole: {
		input: z.object({
			workspaceId: z.string(),
			userId: z.string(),
			role: workspaceRoleEnum,
		}),
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
		getTakenWorkspaceUrls: () => workspaceService.getTakenWorkspaceUrls(),
		getWorkspaceLabels: (input) => workspaceService.getWorkspaceLabels(input),
		createWorkspaceLabel: (input) =>
			workspaceService.createWorkspaceLabel(input),
		updateWorkspaceLabel: (input) =>
			workspaceService.updateWorkspaceLabel(input),
		deleteWorkspaceLabel: (input) =>
			workspaceService.deleteWorkspaceLabel(input),
		updateWorkspaceRole: (input) => workspaceService.updateWorkspaceRole(input),
	});

export { WorkspaceService } from "./workspace-service";
