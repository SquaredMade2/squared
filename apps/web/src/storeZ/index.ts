import { createStore } from "zustand/vanilla";
import { initTaskState } from "./tasks";
import type { TaskActions, TaskState } from "./tasks/interfaces";
import type { WorkspaceActions, WorkspaceState } from "./workspaces/interfaces";
import { initWorkspaceState } from "./workspaces";
import type { TeamActions, TeamState } from "./teams/interfaces";
import { initTeamState } from "./teams";

export type SquaredState = {
	tasks: TaskState;
	workspaces: WorkspaceState;
	teams: TeamState;
};

export type SquaredActions = {
	tasks: TaskActions;
	workspaces: WorkspaceActions;
	teams: TeamActions;
};

export type SquaredStore = SquaredState & SquaredActions;

export const defaultInitState: SquaredState = {
	tasks: initTaskState,
	workspaces: initWorkspaceState,
	teams: initTeamState,
};

export const createSquaredStore = (
	initState: SquaredState = defaultInitState,
) => {
	return createStore<SquaredStore>()(() => ({
		...defaultInitState,
		tasks: initTaskState,
		workspaces: initWorkspaceState,
		teams: initTeamState,
	}));
};
