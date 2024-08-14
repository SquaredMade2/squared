import { createStore } from "zustand/vanilla";
export * from "./interfaces";
import type { WorkspaceState, WorkspaceStore } from "./interfaces";

export const createWorkspaceStore = (
  initState: WorkspaceState = {
    workspaces: [],
    currentWorkspace: null,
  }
) => {
  return createStore<WorkspaceStore>()((set) => ({
    ...initState,
    addWorkspace: (team) => (state) => {
      set({
        workspaces: [...state.workspaces, team],
      });
      return team;
    },
  }));
};
