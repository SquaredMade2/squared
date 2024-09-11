import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import type {
	WorkspaceState,
	WorkspaceStore,
	WorkspaceResponse,
} from "./interfaces";
import type { Label, SavedFilter, User, Workspace } from "@repo/db";
import type { ApiReturnType } from "../interfaces";
export * from "./interfaces";
export * from "./store";

const apiString = (path: string) =>
	`${process.env.NEXT_PUBLIC_SERVERZ}/api/workspace/${path}`;

const WORKSPACE_TEMPLATE: Partial<Workspace> = {
	name: "",
	url: "",
	companySize: null,
	issuesCreated: 0,
	universalTokenLinkId: null,
	githubRepoInfoId: null,
};

export const createWorkspaceStore = (
	initState: WorkspaceState = {
		workspaces: [],
		currentWorkspace: null,
		workspaceLabels: [],
		workspaceFilters: [],
	},
) => {
	return createStore<WorkspaceStore>()(
		persist(
			(set, get) => ({
				...initState,
				addWorkspace: async (
					workspace: Partial<Workspace>,
					userId: string,
				): Promise<WorkspaceResponse> => {
					const workspaceId = uuidv4();

					try {
						const response: {
							data: ApiReturnType<Workspace & { SavedFilter: SavedFilter[] }>;
						} = await axios.post(apiString(workspaceId), {
							workspace: {
								id: workspaceId,
								...WORKSPACE_TEMPLATE,
								...workspace,
							},
							userId,
						});

						const { message, variant, data: newWorkspace } = response.data;

						if (!newWorkspace) {
							return { workspace: null, message, variant };
						}

						set((state) => ({
							...state,
							workspaces: [...state.workspaces, newWorkspace],
							currentWorkspace: newWorkspace,
							workspaceFilters: newWorkspace.SavedFilter,
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
				): Promise<WorkspaceResponse> => {
					const { workspaces } = get();
					const stateWorkspace = workspaces.find((t) => t.id === workspaceId);
					if (stateWorkspace) {
						return {
							workspace: stateWorkspace,
							message: "Workspace found successfully",
							variant: "default",
						};
					}

					try {
						const {
							data: response,
						}: { data: ApiReturnType<Workspace & { Label: Label[] }> } =
							await axios.get(apiString(workspaceId));
						const { data: workspace, message, variant } = response;
						set({ workspaceLabels: workspace?.Label });
						if (!workspace) {
							return {
								workspace: null,
								message,
								variant,
							};
						}
						return { workspace, message, variant };
					} catch (error) {
						console.error("Error in getWorkspace:", error);
						return {
							workspace: null,
							message: error instanceof Error ? error.message : "Unknown error",
							variant: "destructive",
						};
					}
				},
				getWorkspaceLabels: async (workspaceId: string): Promise<Label[]> => {
					try {
						const { data: response }: { data: ApiReturnType<Label[]> } =
							await axios.get(`${apiString(workspaceId)}/label`);
						const { data: labels } = response;
						if (!labels) {
							return [];
						}
						set({ workspaceLabels: labels });

						return labels;
					} catch (error) {
						console.error("Error in getWorkspaceLabels:", error);
						return [];
					}
				},
				getWorkspaceFilters: async (
					workspaceId: string,
				): Promise<SavedFilter[]> => {
					try {
						const { data: response }: { data: ApiReturnType<SavedFilter[]> } =
							await axios.get(`${apiString(workspaceId)}/filter`);
						const { data: filters } = response;
						if (!filters) {
							return [];
						}
						set({ workspaceFilters: filters });

						return filters;
					} catch (error) {
						console.error("Error in getWorkspaceFilters:", error);
						return [];
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
				setCurrentWorkspace: (workspace: Workspace): void => {
					set({ currentWorkspace: workspace });
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
						const { data: response }: { data: ApiReturnType<Workspace[]> } =
							await axios.get(
								`${process.env.NEXT_PUBLIC_SERVERZ}/api/user/${userId}/workspace`,
							);
						const { data: workspaces } = response;
						if (!workspaces) {
							set({ workspaces: [] });
							return [];
						}
						set({ workspaces });

						return workspaces;
					} catch (error) {
						console.error("Error in getAllWorkspaces:", error);
						return [];
					}
				},
				inviteToWorkspace: async (
					workspaceId: string,
					email: string | string[],
				) => {
					try {
						const response = await axios.post(
							`${apiString(workspaceId)}/invite`,
							{ email },
						);

						return response.data;
					} catch (error) {
						console.error("Error inviting user to workspace:", error);
						throw new Error(
							error instanceof Error ? error.message : "Unknown error",
						);
					}
				},
				joinWorkspace: async (token: string, user: User) => {
					try {
						const response = await axios.post(`${apiString("join")}`, {
							token,
							user,
						});

						const { workspace, message, variant } = response.data;
						if (workspace) {
							set((state) => ({
								workspaces: [...state.workspaces, workspace],
								currentWorkspace: workspace,
							}));
						}
						return { workspace, message, variant };
					} catch (error) {
						console.error("Error joining workspace:", error);
						throw new Error(
							error instanceof Error ? error.message : "Unknown error",
						);
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
