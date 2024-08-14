import { createStore } from "zustand/vanilla";
import type { Workspace } from "@repo/db";

export type WorkspaceState = {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
};

export type WorkspaceActions = {
  addWorkspace: (workspace: Workspace) => void;
};

export type WorkspaceStore = WorkspaceState & WorkspaceActions;

export const createWorkspaceStore = (
  initState: WorkspaceState = {
    workspaces: [],
    currentWorkspace: null,
  }
) => {
  return createStore<WorkspaceStore>()((set) => ({
    ...initState,
    addWorkspace: (workspace) => {
      set((state) => ({
        workspaces: [...state.workspaces, workspace],
      }));
    },
  }));
};
