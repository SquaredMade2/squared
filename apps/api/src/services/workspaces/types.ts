import type { WorkspaceLabel } from "@squared/db";

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
	createWorkspace: (args: CreateWorkspaceParams) => Promise<WorkspaceLabel>;
	getWorkspace: (args: {
		workspaceId: string;
	}) => Promise<WorkspaceLabel | null>;
	getWorkspaceByUrl: (args: {
		url: string;
	}) => Promise<WorkspaceLabel | null>;
	updateWorkspace: (args: {
		workspaceId: string;
		workspace: WorkspaceParams;
	}) => Promise<WorkspaceLabel>;
	deleteWorkspace: (args: { workspaceId: string }) => Promise<void>;
	getUserWorkspaces: (args: { userId: string }) => Promise<WorkspaceLabel[]>;
	joinWorkspace: (args: {
		token: string;
		userId: string;
	}) => Promise<WorkspaceLabel | null>;
	removeUserFromWorkspace: (args: {
		workspaceId: string;
		userId: string;
	}) => Promise<{ success: boolean }>;
	inviteToWorkspace: (args: {
		workspaceId: string;
		email: string | string[];
	}) => Promise<{ success: boolean }>;
}
