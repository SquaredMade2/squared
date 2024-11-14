import type { Label, Workspace as WorkspaceType } from "@squared/db";

export type WorkspaceState = {
	workspaces: Workspace[];
	workspace: Workspace | null;
};

export type Workspace = WorkspaceType & {
	Labels: Label[];
};

type WorkspaceActions = {
	setWorkspace: (workspace: Workspace | null) => void;
	setWorkspaces: (workspaces: Workspace[]) => void;
	updateWorkspace: (workspace: Workspace) => void;
	createWorkspace: (workspace: Workspace) => void;
	deleteWorkspace: (workspaceId: string) => void;
};

export type WorkspaceStore = WorkspaceActions & WorkspaceState;
