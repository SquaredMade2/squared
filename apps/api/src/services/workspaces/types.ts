import type { Label, Workspace, WorkspaceRole } from "@squared/db";

export type WorkspaceParams = {
	url: string;
	name: string;
	defaultView?: string | null;
};

export type CreateWorkspaceParams = {
	userId: string;
	workspace: {
		url: string;
		name: string;
	};
};

export interface WorkspaceRpc {
	createWorkspace: (args: CreateWorkspaceParams) => Promise<Workspace>;
	getWorkspace: (args: {
		workspaceId: string;
	}) => Promise<Workspace | null>;
	getWorkspaceByUrl: (args: {
		url: string;
	}) => Promise<Workspace | null>;
	updateWorkspace: (args: {
		workspaceId: string;
		workspace: WorkspaceParams;
	}) => Promise<Workspace>;
	deleteWorkspace: (args: { workspaceId: string }) => Promise<void>;
	getUserWorkspaces: (args: { userId: string }) => Promise<Workspace[]>;
	joinWorkspace: (args: {
		token: string;
		userId: string;
		role?: WorkspaceRole;
	}) => Promise<Workspace | null>;
	removeUserFromWorkspace: (args: {
		workspaceId: string;
		userId: string;
	}) => Promise<{ success: boolean }>;
	inviteToWorkspace: (args: {
		workspaceId: string;
		email: string | string[];
	}) => Promise<{ success: boolean }>;
	getWorkspaceLabels: (args: { workspaceId: string }) => Promise<Label[]>;
	createWorkspaceLabel: (args: {
		workspaceId: string;
		label: Label;
	}) => Promise<{ success: boolean }>;
	deleteWorkspaceLabel: (args: {
		workspaceId: string;
		labelName: string;
	}) => Promise<{ success: boolean }>;
}
