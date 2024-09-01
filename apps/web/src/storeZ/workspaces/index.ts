import { createStore } from "zustand/vanilla";
export * from "./interfaces";
import type {
	WorkspaceResponse,
	WorkspaceState,
	WorkspaceStore,
} from "./interfaces";
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
					const {
						workspace: newWorkspace,
						message,
						variant,
					}: WorkspaceResponse = await axios.post(
						apiString(workspace.id),
						workspace,
					);
					const { workspaces } = useWorkspaceStore();
					if (!newWorkspace) {
						return { workspace: null, message, variant };
					}
					set({
						workspaces: [...workspaces, newWorkspace],
						currentWorkspace: newWorkspace,
					});
					return { workspace: newWorkspace, message, variant };
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
