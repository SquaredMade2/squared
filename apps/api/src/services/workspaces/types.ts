import type { Label, Workspace } from "@squared/db";

export type WorkspaceParams = {
	url: string;
	name: string;
	defaultView: string | null;
};

export type WorkspaceLabels = Workspace & {
	Labels: Label[];
};

export type CreateWorkspaceParams = {
	userId: string;
	workspace: WorkspaceParams;
};

export interface WorkspaceRpc {
	createWorkspace: (args: CreateWorkspaceParams) => Promise<WorkspaceLabels>;
	getWorkspace: (args: {
		workspaceId: string;
	}) => Promise<WorkspaceLabels | null>;
	getWorkspaceByUrl: (args: {
		url: string;
	}) => Promise<WorkspaceLabels | null>;
	updateWorkspace: (args: {
		workspaceId: string;
		workspace: WorkspaceParams;
	}) => Promise<WorkspaceLabels>;
	deleteWorkspace: (args: { workspaceId: string }) => Promise<void>;
	getUserWorkspaces: (args: { userId: string }) => Promise<WorkspaceLabels[]>;
	joinWorkspace: (args: {
		token: string;
		userId: string;
	}) => Promise<WorkspaceLabels | null>;
	removeUserFromWorkspace: (args: {
		workspaceId: string;
		userId: string;
	}) => Promise<void>;
	inviteToWorkspace: (args: {
		workspaceId: string;
		email: string | string[];
	}) => Promise<void>;
}
