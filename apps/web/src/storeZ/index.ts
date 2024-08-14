import { createStore } from "zustand/vanilla";
import type { StoreApi } from "zustand/vanilla";
import { createTaskStore } from "./tasks";
import type { TaskStore } from "./tasks";
import { createWorkspaceStore } from "./workspaces";
import type { WorkspaceStore } from "./workspaces";
import { createTeamStore } from "./teams";
import type { TeamStore } from "./teams";

export type SquaredState = {
  tasks: StoreApi<TaskStore>;
  workspaces: StoreApi<WorkspaceStore>;
  teams: StoreApi<TeamStore>;
};

export const createSquaredStore = () => {
  return createStore<SquaredState>()(() => ({
    tasks: createTaskStore(),
    workspaces: createWorkspaceStore(),
    teams: createTeamStore(),
  }));
};
