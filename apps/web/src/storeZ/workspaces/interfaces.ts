import type { Workspace } from "@repo/db";

export type WorkspaceState = {
	workspaces: Workspace[];
	currentWorkspace: Workspace | null;
};

export interface WorkspaceResponse {
	workspace: Workspace | null;
	message?: string;
	variant: "default" | "destructive";
}

export type WorkspaceActions = {
	addWorkspace: (workspace: Partial<Workspace>) => Promise<WorkspaceResponse>;
	getWorkspace: (workspaceId: string) => Promise<Workspace | undefined>;
	updateWorkspace: (
		workspaceId: string,
		workspace: Partial<Workspace>,
	) => Promise<Workspace>;
	deleteWorkspace: (workspaceId: string) => void;
	getAllWorkspaces: (userId: string) => Promise<Workspace[]>;
};

export type WorkspaceStore = WorkspaceActions & WorkspaceState;
