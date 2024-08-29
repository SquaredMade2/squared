import { createStore } from "zustand/vanilla";
export * from "./interfaces";
import type { WorkspaceState, WorkspaceStore } from "./interfaces";
import type { Workspace } from "@repo/db";
import axios from "axios";

const apiString = (path: string) =>
	`${process.env.NEXT_PUBLIC_SERVERZ}/api/workspace/${path}`;

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
		getWorkspace: (workspaceId) => async (state) => {
			const stateWorkspace = state.workspaces.find((t) => t.id === workspaceId);
			return stateWorkspace || (await axios.get(apiString(workspaceId)));
		},
		updateWorkspace: (workspaceId, workspace) => async (state) => {
			const updatedWorkspace: Workspace = await axios.put(
				apiString(workspaceId),
				workspace,
			);
			set({
				workspaces: state.workspaces.map((t) =>
					t.id === workspaceId ? updatedWorkspace : t,
				),
			});
			return updatedWorkspace;
		},
		deleteWorkspace: (workspaceId) => (state) => {
			axios.delete(apiString(workspaceId));
			set({
				workspaces: state.workspaces.filter((t) => t.id !== workspaceId),
			});
		},
		getAllWorkspaces: (userId) =>
			axios
				.get(`${process.env.NEXT_PUBLIC_SERVERZ}/api/user/${userId}/workspaces`)
				.then((response) => {
					set({ workspaces: response.data });
					return response.data;
				})
				.catch((err) => console.error(err)),
	}));
};
