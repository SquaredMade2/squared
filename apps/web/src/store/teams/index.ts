import type { Sprint, Team } from "@squared/db";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";
import type { ApiReturnType } from "../interfaces";
import type { TeamResponse, TeamState, TeamStore } from "./interfaces";
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
						const { data: response }: { data: ApiReturnType<Team> } =
							await axios.get(apiString(teamId));
						const { data: team, ...rest } = response;
						return { ...rest, team };
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
