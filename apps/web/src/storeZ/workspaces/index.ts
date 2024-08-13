import type { Workspace } from "@repo/db";
import type {
	WorkspaceActions,
	WorkspaceState,
	WorkspaceStore,
} from "./interfaces";
import axios from "axios";

const apiString = (path: string) => {
	return `${process.env.SERVER_URL}/api/workspace/${path}`;
};

export const workspaceActions: WorkspaceActions = {
	addWorkspace: (workspace: Workspace) => (state: WorkspaceState) => {
		return {
			...state,
			workspaces: [...state.workspaces, workspace],
		};
	},
};

export const workspaceState: WorkspaceState = {
	workspaces: [],
	currentWorkspace: null,
};

export const initWorkspaceState: WorkspaceStore = {
	...workspaceState,
	...workspaceActions,
};
