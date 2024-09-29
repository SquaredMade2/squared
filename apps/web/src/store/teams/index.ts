import { createStore } from "zustand/vanilla";
import axios from "axios";
import { persist } from "zustand/middleware";
import type {
	TeamState,
	TeamStore,
	TeamResponse,
	SprintResponse,
	InitializeSprintsBody,
} from "./interfaces";
import type { Sprint, Team } from "@repo/db";
import type { ApiReturnType } from "../interfaces";
import { v4 as uuidv4 } from "uuid";
export * from "./interfaces";
export * from "./store";

const apiString = (path: string) =>
	`${process.env.NEXT_PUBLIC_SERVER}/api/team/${path}`;
const sprintApiString = (path: string) =>
	`${process.env.NEXT_PUBLIC_SERVER}/api/sprint/${path}`;

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
				getAllTeams: async (workspaceId: string): Promise<Team[]> => {
					try {
						const { data: response }: { data: ApiReturnType<Team[]> } =
							await axios.get(
								`${process.env.NEXT_PUBLIC_SERVER}/api/workspace/${workspaceId}/team`,
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
						const response: { data: ApiReturnType<Sprint[]> } =
							await axios.post(apiString(`${teamId}/sprints`), sprint);
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
							apiString(`${teamId}/sprint`),
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
					sprintId: string,
					sprint: Partial<Sprint>,
				): Promise<SprintResponse> => {
					try {
						const response: { data: ApiReturnType<Sprint> } = await axios.put(
							sprintApiString(sprintId),
							sprint,
						);
						const updatedSprint = response.data.data;
						if (!updatedSprint) {
							return {
								sprint: null,
								message: response.data.message,
								variant: response.data.variant,
							};
						}
						set((state) => ({
							sprints: state.sprints.map((s) =>
								s.id === sprint.id ? updatedSprint : s,
							),
						}));

						return {
							sprint: updatedSprint,
							message: response.data.message,
							variant: response.data.variant,
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
