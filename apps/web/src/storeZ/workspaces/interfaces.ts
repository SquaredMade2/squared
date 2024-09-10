import type { Label, User, Workspace } from "@repo/db";

export type WorkspaceState = {
	workspaces: Workspace[];
	currentWorkspace: Workspace | null;
	workspaceLabels: Label[];
};

export interface WorkspaceResponse {
	workspace: Workspace | null;
	message?: string;
	variant: "default" | "destructive";
}

export type WorkspaceActions = {
	addWorkspace: (
		workspace: Partial<Workspace>,
		userId: string,
	) => Promise<WorkspaceResponse>;
	getWorkspace: (workspaceId: string) => Promise<WorkspaceResponse>;
	getWorkspaceLabels: (workspaceId: string) => Promise<Label[]>;
	setCurrentWorkspace: (workspace: Workspace) => void;
	updateWorkspace: (
		workspaceId: string,
		workspace: Partial<Workspace>,
	) => Promise<Workspace>;
	deleteWorkspace: (workspaceId: string) => void;
	getAllWorkspaces: (userId: string) => Promise<Workspace[]>;
	joinWorkspace: (token: string, user: User) => Promise<WorkspaceResponse>;
	inviteToWorkspace: (
		workspaceId: string,
		email: string | string[],
	) => Promise<void>;
};

export type WorkspaceStore = WorkspaceActions & WorkspaceState;
