import type { Workspace, WorkspaceRole } from "@squared/db";

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
		isLink: boolean;
		userId: string;
		workspaceName?: string;
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
	generateWorkspaceInviteLink: (args: {
		workspaceId: string;
		expiration?: string;
		uses?: number;
	}) => Promise<string>;
}
