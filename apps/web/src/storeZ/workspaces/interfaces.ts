import type { Workspace } from "@repo/db";

export type WorkspaceActions = {
  addWorkspace: (
    workspace: Workspace
  ) => (state: WorkspaceState) => Workspace;
};

export type WorkspaceState = {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
};

export type WorkspaceStore = WorkspaceActions & WorkspaceState;
