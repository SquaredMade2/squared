import { createStore } from "zustand/vanilla";
import axios, { isAxiosError } from "axios";
import { persist } from "zustand/middleware";
import type {
	TeamState,
	TeamStore,
	TeamResponse,
	SprintResponse,
	InitializeSprintsBody,
	RetrospectiveItemResponse,
	RetrospectiveData,
} from "./interfaces";
import type { RetrospectiveItem, Sprint, Task, Team } from "@squared/db";
import type { ApiReturnType } from "../interfaces";
import { v4 as uuidv4 } from "uuid";
export * from "./interfaces";
export * from "./store";

const apiString = (path: string) =>
	`${process.env.NEXT_PUBLIC_SERVER}/api/team/${path}`;

export const createTeamStore = (
	initState: TeamState = {
		teams: [],
		currentTeam: null,
		sprints: [],
		currentSprint: null,
	},
) => {
	return createStore<TeamStore>()(
		persist(
			(set, get) => ({
				...initState,
				addTeam: async (team: Partial<Team>): Promise<TeamResponse> => {
					try {
						const response: { data: ApiReturnType<Team> } = await axios.post(
							apiString(team.id ?? uuidv4()),
							team,
						);
						const { data: newTeam, message, variant } = response.data;

						if (!newTeam) {
							return { team: null, message, variant };
						}

						const { teams } = get();
						set({ teams: [...teams, newTeam] });

						return { team: newTeam, message, variant };
					} catch (error) {
						return {
							team: null,
							message: error instanceof Error ? error.message : "Unknown error",
							variant: "destructive",
						};
					}
				},
				getTeam: async (teamId: string): Promise<TeamResponse> => {
					const { teams } = get();
					const existingTeam = teams.find((t) => t.id === teamId);
					if (existingTeam) {
						return {
							team: existingTeam,
							message: "Team found",
							variant: "default",
						};
					}

					try {
						const response: { data: ApiReturnType<Team> } = await axios.get(
							apiString(teamId),
						);
						return { ...response.data, team: response.data.data };
					} catch (error) {
						return {
							team: null,
							message: error instanceof Error ? error.message : "Unknown error",
							variant: "destructive",
						};
					}
				},
				setCurrentTeam: (team: Team): void => {
					set({ currentTeam: team });
				},
				updateTeam: async (
					teamId: string,
					team: Partial<Team>,
				): Promise<TeamResponse> => {
					try {
						const response: { data: ApiReturnType<Team> } = await axios.put(
							apiString(teamId),
							team,
						);
						const updatedTeam = response.data.data;
						if (!updatedTeam) {
							return {
								team: null,
								message: response.data.message,
								variant: response.data.variant,
							};
						}
						set((state) => ({
							teams: state.teams.map((t) =>
								t.id === teamId ? updatedTeam : t,
							),
						}));

						return {
							team: updatedTeam,
							message: response.data.message,
							variant: response.data.variant,
						};
					} catch (error) {
						return {
							team: null,
							message: error instanceof Error ? error.message : "Unknown error",
							variant: "destructive",
						};
					}
				},
				deleteTeam: async (teamId: string): Promise<void> => {
					try {
						await axios.delete(apiString(teamId));
						set((state) => ({
							teams: state.teams.filter((t) => t.id !== teamId),
						}));
					} catch (error) {
						console.error("Error in deleteTeam:", error);
					}
				},
				getAllTeams: async (userId: string): Promise<Team[]> => {
					try {
						const { data: response }: { data: ApiReturnType<Team[]> } =
							await axios.get(
								`${process.env.NEXT_PUBLIC_SERVER}/api/user/${userId}/team`,
							);
						const { data: teams } = response;
						if (!teams) {
							set({ teams: [] });
							return [];
						}
						set({ teams });
						return teams;
					} catch (error) {
						console.error("Error in getAllTeams:", error);
						return [];
					}
				},
				initializeSprints: async (
					teamId: string,
					sprint: InitializeSprintsBody,
				): Promise<Sprint[]> => {
					try {
						// Get current sprints
						const currentSprints = await get().getSprints(teamId);

						// Filter pending sprints
						const pendingSprints = currentSprints.filter(
							(s) => s.status === "PLANNED",
						);

						// Calculate how many sprints we can create
						const sprintsToCreate = Math.max(0, 3 - pendingSprints.length);

						if (sprintsToCreate === 0) {
							return [];
						}

						// Modify the request to create only the allowed number of sprints
						const modifiedSprint = { ...sprint, count: sprintsToCreate };

						const response: { data: ApiReturnType<Sprint[]> } =
							await axios.post(apiString(`${teamId}/sprints`), modifiedSprint);
						const { data: newSprints } = response.data;

						if (!newSprints) {
							return [];
						}

						const { sprints } = get();
						set({ sprints: [...sprints, ...newSprints] });

						return newSprints;
					} catch {
						return [];
					}
				},
				getSprints: async (teamId: string): Promise<Sprint[]> => {
					try {
						const response: { data: ApiReturnType<Sprint[]> } = await axios.get(
							apiString(`${teamId}/sprints`),
						);
						const { data: sprints } = response.data;
						if (!sprints) {
							set({ sprints: [] });
							return [];
						}
						set({ sprints });
						return sprints;
					} catch (error) {
						console.error("Error in getSprints:", error);
						return [];
					}
				},
				updateSprint: async (
					teamId: string,
					sprintId: string,
					sprint: Partial<Sprint>,
				): Promise<SprintResponse> => {
					try {
						const { data }: { data: ApiReturnType<Sprint> } = await axios.put(
							`${apiString(teamId)}/sprints/${sprintId}`,
							sprint,
						);
						const { data: updatedSprint, message, variant } = data;
						if (!updatedSprint) {
							return {
								sprint: null,
								message,
								variant,
							};
						}
						set((state) => ({
							sprints: state.sprints.map((s) =>
								s.id === sprint.id ? updatedSprint : s,
							),
						}));

						return {
							sprint: updatedSprint,
							message,
							variant,
						};
					} catch (error) {
						return {
							sprint: null,
							message: error instanceof Error ? error.message : "Unknown error",
							variant: "destructive",
						};
					}
				},
				setCurrentSprint: (sprint: Sprint): void => {
					set({ currentSprint: sprint });
				},
				startNextSprint: async (
					teamId: string,
					movedTasks: string[],
					sprintData?: Partial<Sprint>,
				): Promise<SprintResponse> => {
					try {
						const { data }: { data: ApiReturnType<Sprint> } = await axios.put(
							`${apiString(teamId)}/sprints/next`,
							{ movedTasks, sprintData },
						);
						const { data: newSprint, message, variant } = data;

						if (!newSprint) {
							return {
								sprint: null,
								message,
								variant,
							};
						}
						const existingSprint = get().sprints.findIndex(
							(s) => s.id === newSprint.id,
						);

						set((state) => {
							if (existingSprint > -1) {
								state.sprints[existingSprint] = newSprint;
								return { sprints: state.sprints };
							}
							return { sprints: [...state.sprints, newSprint] };
						});

						return {
							sprint: newSprint,
							message,
							variant,
						};
					} catch (error) {
						return {
							sprint: null,
							message: error instanceof Error ? error.message : "Unknown error",
							variant: "destructive",
						};
					}
				},
				getSprintTasks: async (
					teamId: string,
					sprintId: string,
				): Promise<Task[]> => {
					return axios
						.get(apiString(`${teamId}/sprints/${sprintId}/tasks`))
						.then(
							(response: { data: ApiReturnType<Task[]> }) =>
								response.data.data ?? [],
						);
				},
				endSprint: async (
					teamId: string,
					sprintId: string,
				): Promise<SprintResponse> => {
					try {
						const { data }: { data: ApiReturnType<Sprint> } =
							await axios.delete(
								`${apiString(teamId)}/sprints/${sprintId}/tasks`,
							);
						const { data: updatedSprint, message, variant } = data;
						if (!updatedSprint) {
							return {
								sprint: null,
								message,
								variant,
							};
						}
						set((state) => ({
							sprints: state.sprints.map((s) =>
								s.id === sprintId ? updatedSprint : s,
							),
						}));

						return {
							sprint: updatedSprint,
							message,
							variant,
						};
					} catch (error) {
						return {
							sprint: null,
							message: error instanceof Error ? error.message : "Unknown error",
							variant: "destructive",
						};
					}
				},
				addRetrospectiveItem: async (
					sprintId,
					type,
					content,
				): Promise<RetrospectiveItemResponse> => {
					try {
						const { currentTeam } = get();
						const { data }: { data: ApiReturnType<RetrospectiveItem> } =
							await axios.post(
								apiString(
									`${currentTeam?.id}/sprints/${sprintId}/retrospective`,
								),
								{
									type,
									content,
								},
							);
						return {
							item: data.data,
							message: data.message,
							variant: data.variant,
						};
					} catch (error) {
						console.error("Error in addRetrospectiveItem:", error);
						if (isAxiosError(error)) {
							return {
								item: null,
								message: error.response?.data.message || "An error occurred",
								variant: "destructive",
							};
						}
						throw error;
					}
				},
				updateRetrospectiveItemType: async (
					sprintId,
					itemId,
					type,
				): Promise<RetrospectiveItemResponse> => {
					try {
						const { currentTeam } = get();
						const { data }: { data: ApiReturnType<RetrospectiveItem> } =
							await axios.put(
								apiString(
									`${currentTeam?.id}/sprints/${sprintId}/retrospective`,
								),
								{
									itemId,
									type,
								},
							);
						return {
							item: data.data,
							message: data.message,
							variant: data.variant,
						};
					} catch (error) {
						console.error("Error in updateRetrospectiveItem:", error);
						if (isAxiosError(error)) {
							return {
								item: null,
								message: error.response?.data.message || "An error occurred",
								variant: "destructive",
							};
						}
						throw error;
					}
				},
				getRetrospectiveItems: async (sprintId): Promise<RetrospectiveData> => {
					try {
						const { currentTeam } = get();
						const { data }: { data: ApiReturnType<RetrospectiveData> } =
							await axios.get(
								apiString(
									`${currentTeam?.id}/sprints/${sprintId}/retrospective`,
								),
							);
						if (!data.data) {
							return {
								wentWell: [],
								toImprove: [],
								actionItems: [],
							};
						}
						return data.data;
					} catch (error) {
						console.error("Error in getRetrospectiveItems:", error);
						return {
							wentWell: [],
							toImprove: [],
							actionItems: [],
						};
					}
				},
			}),
			{
				name: "team-store",
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
