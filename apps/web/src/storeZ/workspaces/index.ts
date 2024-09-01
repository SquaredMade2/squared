import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import type {
	WorkspaceState,
	WorkspaceStore,
	WorkspaceResponse,
} from "./interfaces";
import type { Workspace } from "@repo/db";
export { type WorkspaceStore } from "./interfaces";

const apiString = (path: string) =>
	`${process.env.NEXT_PUBLIC_SERVERZ}/api/workspace/${path}`;

const WORKSPACE_TEMPLATE: Partial<Workspace> = {
	name: "",
	url: "",
	companySize: null,
	issuesCreated: null,
	universalTokenLinkId: null,
	githubRepoInfoId: null,
};

export const createWorkspaceStore = (
	initState: WorkspaceState = {
		workspaces: [],
		currentWorkspace: null,
	},
) => {
	return createStore<WorkspaceStore>()(
		persist(
			(set, get) => ({
				...initState,
				addWorkspace: async (
					workspace: Partial<Workspace>,
				): Promise<WorkspaceResponse> => {
					const workspaceId = uuidv4();

					try {
						const response = await axios.post<WorkspaceResponse>(
							apiString(workspaceId),
							{
								id: workspaceId,
								...WORKSPACE_TEMPLATE,
								...workspace,
							},
						);

						const { message, variant, workspace: newWorkspace } = response.data;

						if (!newWorkspace) {
							return { workspace: null, message, variant };
						}

						set((state) => ({
							...state,
							workspaces: [...state.workspaces, newWorkspace],
							currentWorkspace: newWorkspace,
						}));

						return { workspace: newWorkspace, message, variant };
					} catch (error) {
						console.error("Error in addWorkspace:", error);
						return {
							workspace: null,
							message: error instanceof Error ? error.message : "Unknown error",
							variant: "destructive",
						};
					}
				},
				getWorkspace: async (
					workspaceId: string,
				): Promise<Workspace | undefined> => {
					const { workspaces } = get();
					const stateWorkspace = workspaces.find((t) => t.id === workspaceId);
					if (stateWorkspace) {
						return stateWorkspace;
					}

					try {
						const response = await axios.get<Workspace>(apiString(workspaceId));
						return response.data;
					} catch (error) {
						console.error("Error in getWorkspace:", error);
						return undefined;
					}
				},
				updateWorkspace: async (
					workspaceId: string,
					workspace: Partial<Workspace>,
				): Promise<Workspace> => {
					try {
						const response = await axios.put<Workspace>(
							apiString(workspaceId),
							workspace,
						);
						const updatedWorkspace = response.data;

						set((state) => ({
							workspaces: state.workspaces.map((t) =>
								t.id === workspaceId ? updatedWorkspace : t,
							),
						}));

						return updatedWorkspace;
					} catch (error) {
						console.error("Error in updateWorkspace:", error);
						throw error;
					}
				},
				deleteWorkspace: (workspaceId: string): void => {
					try {
						axios.delete(apiString(workspaceId));
						set((state) => ({
							workspaces: state.workspaces.filter((t) => t.id !== workspaceId),
						}));
					} catch (error) {
						console.error("Error in deleteWorkspace:", error);
					}
				},
				getAllWorkspaces: async (userId: string): Promise<Workspace[]> => {
					try {
						const response = await axios.get<Workspace[]>(
							`${process.env.NEXT_PUBLIC_SERVERZ}/api/user/${userId}/workspaces`,
						);

						set({ workspaces: response.data });

						return response.data;
					} catch (error) {
						console.error("Error in getAllWorkspaces:", error);
						return [];
					}
				},
			}),
			{
				name: "workspace-store",
				getStorage: () => sessionStorage,
			},
		),
	);
};
