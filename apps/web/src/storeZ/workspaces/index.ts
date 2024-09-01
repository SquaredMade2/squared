import { createStore } from "zustand/vanilla";
export * from "./interfaces";
import type { WorkspaceState, WorkspaceStore } from "./interfaces";
import type { Workspace } from "@repo/db";
import axios from "axios";
import { persist } from "zustand/middleware";
import { useWorkspaceStore } from "../provider";

const apiString = (path: string) =>
	`${process.env.NEXT_PUBLIC_SERVERZ}/api/workspace/${path}`;

export const createWorkspaceStore = (
	initState: WorkspaceState = {
		workspaces: [],
		currentWorkspace: null,
	},
) => {
	return createStore<WorkspaceStore>()(
		persist(
			(set) => ({
				...initState,
				addWorkspace: async (workspace) => {
					const newWorkspace: Workspace = await axios.post(
						apiString(workspace.id),
						workspace,
					);
					const { workspaces } = useWorkspaceStore();
					set({
						workspaces: [...workspaces, newWorkspace],
						currentWorkspace: newWorkspace,
					});
					return newWorkspace;
				},
				getWorkspace: async (workspaceId) => {
					const { workspaces } = useWorkspaceStore();
					const stateWorkspace = workspaces.find((t) => t.id === workspaceId);
					return stateWorkspace || (await axios.get(apiString(workspaceId)));
				},
				updateWorkspace: async (workspaceId, workspace) => {
					const updatedWorkspace: Workspace = await axios.put(
						apiString(workspaceId),
						workspace,
					);
					const { workspaces } = useWorkspaceStore();
					set({
						workspaces: workspaces.map((t) =>
							t.id === workspaceId ? updatedWorkspace : t,
						),
					});
					return updatedWorkspace;
				},
				deleteWorkspace: async (workspaceId) => {
					axios.delete(apiString(workspaceId));
					const { workspaces } = useWorkspaceStore();
					set({
						workspaces: workspaces.filter((t) => t.id !== workspaceId),
					});
				},
				getAllWorkspaces: async (userId) =>
					axios
						.get(
							`${process.env.NEXT_PUBLIC_SERVERZ}/api/user/${userId}/workspaces`,
						)
						.then((response) => {
							set({ workspaces: response.data });
							return response.data;
						})
						.catch((err) => console.error(err)),
			}),
			{
				name: "workspace-store",
				getStorage: () => sessionStorage,
			},
		),
	);
};
