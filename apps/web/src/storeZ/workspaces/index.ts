import { createStore } from "zustand/vanilla";
export * from "./interfaces";
import type { WorkspaceState, WorkspaceStore } from "./interfaces";
import type { Workspace } from "@repo/db";
import axios from "axios";

const apiString = (path: string) =>
	`${process.env.SERVER_URL}/api/workspace/${path}`;

export const createWorkspaceStore = (
	initState: WorkspaceState = {
		workspaces: [],
		currentWorkspace: null,
	},
) => {
	return createStore<WorkspaceStore>()((set) => ({
		...initState,
		addWorkspace: (workspace) => async (state) => {
			const newWorkspace: Workspace = await axios.post(
				apiString(workspace.id),
				workspace,
			);

			set({
				workspaces: [...state.workspaces, newWorkspace],
			});
			return newWorkspace;
		},
	}));
};
