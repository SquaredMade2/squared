import { createStore } from "zustand/vanilla";
import { initTaskState } from "./tasks";
import type { TaskActions, TaskState } from "./tasks/interfaces";
import type { WorkspaceActions, WorkspaceState } from "./workspaces/interfaces";
import { initWorkspaceState } from "./workspaces";
import type { TeamActions, TeamState } from "./teams/interfaces";
import { initTeamState } from "./teams";

export type RootState = {
	tasks: TaskState;
	workspaces: WorkspaceState;
	teams: TeamState;
};

export type RootActions = {
	tasks: TaskActions;
	workspaces: WorkspaceActions;
	teams: TeamActions;
};

export type Store = RootState & RootActions;

export const defaultInitState: RootState = {
	tasks: initTaskState,
	workspaces: initWorkspaceState,
	teams: initTeamState,
};

export const createCounterStore = () => {
	return createStore<Store>()(() => ({
		tasks: initTaskState,
		workspaces: initWorkspaceState,
		teams: initTeamState,
	}));
};
