import { persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";
import type { WorkspaceState, WorkspaceStore } from "./interfaces";
export * from "./interfaces";
export * from "./store";

export const createWorkspaceStore = (
	initState: WorkspaceState = {
		workspaces: [],
		workspace: null,
	},
) => {
	return createStore<WorkspaceStore>()(
		persist(
			(set) => ({
				...initState,
				setWorkspace: (workspace) => set({ workspace }),
				setWorkspaces: (workspaces) => set({ workspaces }),
				createWorkspace: (workspace) =>
					set((state) => ({
						workspaces: [...state.workspaces, workspace],
					})),
				updateWorkspace: (workspace) =>
					set((state) => ({
						workspaces: state.workspaces.map((t) =>
							t.id === workspace.id ? workspace : t,
						),
					})),
				deleteWorkspace: (workspaceId) =>
					set((state) => ({
						workspaces: state.workspaces.filter((t) => t.id !== workspaceId),
					})),
			}),
			{
				name: "workspace-store",
				storage: {
					getItem: (name) => {
						const storedValue = sessionStorage.getItem(name);
						return storedValue ? JSON.parse(storedValue) : null;
					},
					setItem: (name, value) => {
						sessionStorage.setItem(name, JSON.stringify(value));
					},
					removeItem: (name) => {
						sessionStorage.removeItem(name);
					},
				},
			},
		),
	);
};
