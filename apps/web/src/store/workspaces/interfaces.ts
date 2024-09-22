import type { Label, User, Workspace as WorkspaceType } from "@repo/db";
import type { SavedFilter } from "../filters";

export type WorkspaceState = {
	workspaces: Workspace[];
	currentWorkspace: Workspace | null;
	workspaceFilters: SavedFilter[];
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
	getWorkspaceFilters: (workspaceId: string) => Promise<SavedFilter[]>;
	setCurrentWorkspace: (workspace: Workspace) => void;
	updateWorkspace: (
		workspaceId: string,
		workspace: Partial<Workspace>,
	) => Promise<WorkspaceResponse>;
	deleteWorkspace: (workspaceId: string) => Promise<void>;
	getAllWorkspaces: (userId: string) => Promise<Workspace[]>;
	joinWorkspace: (token: string, user: User) => Promise<WorkspaceResponse>;
	inviteToWorkspace: (
		workspaceId: string,
		email: string | string[],
	) => Promise<void>;
};

export type WorkspaceStore = WorkspaceActions & WorkspaceState;
