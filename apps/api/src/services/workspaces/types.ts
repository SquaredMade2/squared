import type { Label, Workspace } from "@squared/db";

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

export type JoinWorkspaceParams = {
	token: string;
	isLink: boolean;
	user: { id: string; name: string; email: string };
	workspace: { id: string; name?: string };
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
	joinWorkspace: (args: JoinWorkspaceParams) => Promise<Workspace | null>;
	removeUserFromWorkspace: (args: {
		workspaceId: string;
		userId: string;
	}) => Promise<{ success: boolean }>;
	inviteToWorkspace: (args: {
		workspaceId: string;
		email: string[];
		userId: string;
		slug: string;
	}) => Promise<{ success: boolean }>;
	generateWorkspaceInviteLink: (args: {
		workspaceId: string;
		expiration?: string;
		uses?: number;
	}) => Promise<string>;
	getTakenWorkspaceUrls: () => Promise<string[]>;
	getWorkspaceLabels: (args: { workspaceId: string }) => Promise<Label[]>;
	createWorkspaceLabel: (args: {
		workspaceId: string;
		label: Label;
	}) => Promise<{ success: boolean; labels?: Label[] }>;
	updateWorkspaceLabel: (args: {
		workspaceId: string;
		labelName: string;
		updatedLabel: Label;
	}) => Promise<{ success: boolean; labels?: Label[] }>;
	deleteWorkspaceLabel: (args: {
		workspaceId: string;
		labelName: string;
	}) => Promise<{ success: boolean }>;
	updateWorkspaceRole: (args: {
		userId: string;
		workspaceId: string;
		role: "org:admin" | "org:member" | "org:owner";
	}) => Promise<void>;
}
