import type { Workspace } from "@repo/db";

export type WorkspaceState = {
	workspaces: Workspace[];
	currentWorkspace: Workspace | null;
};

export type WorkspaceActions = {
	addWorkspace: (
		workspace: Workspace,
	) => (state: WorkspaceState) => Promise<Workspace>;
	getWorkspace: (
		workspaceId: string,
	) => (state: WorkspaceState) => Promise<Workspace | undefined>;
	updateWorkspace: (
		workspaceId: string,
		workspace: Partial<Workspace>,
	) => (state: WorkspaceState) => Promise<Workspace>;
	deleteWorkspace: (workspaceId: string) => (state: WorkspaceState) => void;
	getAllWorkspaces: (userId: string) => Promise<Workspace[]>;
};

export type WorkspaceStore = WorkspaceActions & WorkspaceState;
