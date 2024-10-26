import type { Label, Workspace as WorkspaceType } from "@squared/db";

export type WorkspaceState = {
	workspaces: Workspace[];
	currentWorkspace: Workspace | null;
};

export type Workspace = WorkspaceType & {
	Labels: Label[];
};

export interface WorkspaceResponse {
	workspace: Workspace | null;
	message?: string;
	variant: "default" | "destructive";
}

type WorkspaceActions = {
	addWorkspace: (
		workspace: Partial<Workspace>,
		userId: string,
	) => Promise<WorkspaceResponse>;
	getWorkspace: (workspaceId: string) => Promise<WorkspaceResponse>;
	setCurrentWorkspace: (workspace: Workspace) => void;
	updateWorkspace: (
		workspaceId: string,
		workspace: Partial<Workspace>,
	) => Promise<WorkspaceResponse>;
	deleteWorkspace: (workspaceId: string) => Promise<void>;
	getAllWorkspaces: (userId: string) => Promise<Workspace[]>;
	joinWorkspace: (token: string, userId: string) => Promise<WorkspaceResponse>;
	inviteToWorkspace: (
		workspaceId: string,
		email: string | string[],
	) => Promise<void>;
};

export type WorkspaceStore = WorkspaceActions & WorkspaceState;
