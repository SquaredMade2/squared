import { createStore } from "zustand/vanilla";
import axios from "axios";
import { persist } from "zustand/middleware";
import type {
	TeamState,
	TeamStore,
	TeamResponse,
	InitializeSprintsBody,
} from "./interfaces";
import type { Sprint, Team } from "@squared/db";
import type { ApiReturnType } from "../interfaces";
import { v4 as uuidv4 } from "uuid";
import { sprintService } from "@/lib/services";
export * from "./interfaces";
export * from "./store";
import * as context from "@squared/context";

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
				initializeSprints: async (
					teamId: string,
					sprint: InitializeSprintsBody,
				): Promise<Sprint[]> => {
					try {
						// Get current sprints
						const currentSprints = await sprintService.getSprints(
							context.TODO,
							{ teamId },
						);

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
