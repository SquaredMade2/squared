import { createStore } from "zustand/vanilla";
import type { WorkspaceState, WorkspaceStore } from "./interfaces";

export type { WorkspaceState, WorkspaceStore } from "./interfaces";
export { useWorkspaceStore, WorkspaceStoreProvider } from "./store";

export const createWorkspaceStore = (
	initState: WorkspaceState = {
		workspace: null,
		workspaces: [],
	},
) => {
	return createStore<WorkspaceStore>()((set) => ({
		...initState,
		createWorkspace: (workspace) =>
			set((state) => ({
				workspaces: [...state.workspaces, workspace],
			})),
		deleteWorkspace: (workspaceId) =>
			set((state) => ({
				workspaces: state.workspaces.filter((t) => t.id !== workspaceId),
			})),
		setWorkspace: (workspace) => set({ workspace }),
		setWorkspaces: (workspaces) => set({ workspaces }),
		updateWorkspace: (workspace) =>
			set((state) => ({
				workspaces: state.workspaces.map((t) =>
					t.externalId === workspace.externalId ? workspace : t,
				),
			})),
	}));
};
