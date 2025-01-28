import type { WorkspaceLabel } from "@squared/db";

export type WorkspaceState = {
	workspaces: WorkspaceLabel[];
	workspace: WorkspaceLabel | null;
};

type WorkspaceActions = {
	setWorkspace: (workspace: WorkspaceLabel | null) => void;
	setWorkspaces: (workspaces: WorkspaceLabel[]) => void;
	updateWorkspace: (workspace: WorkspaceLabel) => void;
	createWorkspace: (workspace: WorkspaceLabel) => void;
	deleteWorkspace: (workspaceId: string) => void;
};

export type WorkspaceStore = WorkspaceActions & WorkspaceState;
