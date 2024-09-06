import { createStore } from "zustand/vanilla";
import type { TeamState, TeamStore } from "./interfaces";
import axios from "axios";
import type { Team } from "@repo/db";
import { persist } from "zustand/middleware";
export * from "./interfaces";
export * from "./store";

const apiString = (path: string) =>
	`${process.env.NEXT_PUBLIC_SERVERZ}/api/team/${path}`;

export const createTeamStore = (
	initState: TeamState = { teams: [], currentTeam: null },
) => {
	return createStore<TeamStore>()(
		persist(
			(set, get) => ({
				...initState,
				addTeam: async (team) => {
					const newTeam: Team = await axios.post(apiString(team.id), team);
					const { teams } = get();
					set({ teams: [...teams, newTeam] });
					return team;
				},
				getTeam: async (teamId) => {
					const { teams } = get();
					const stateTeam = teams.find((t) => t.id === teamId);
					return stateTeam || (await axios.get(apiString(teamId)));
				},
				setCurrentTeam: (team) => {
					set({ currentTeam: team });
				},
				updateTeam: async (teamId, team) => {
					const updatedTeam: Team = await axios.put(apiString(teamId), team);
					const { teams } = get();
					set({ teams: teams.map((t) => (t.id === teamId ? updatedTeam : t)) });
					return updatedTeam;
				},
				deleteTeam: async (teamId) => {
					await axios.delete(apiString(teamId));
					const { teams } = get();
					set({ teams: teams.filter((t) => t.id !== teamId) });
				},
				getAllTeams: async (workspaceId) => {
					const response: { data: Team[] } = await axios.get(
						`${process.env.NEXT_PUBLIC_SERVERZ}/api/workspace/${workspaceId}/team`,
					);
					set({ teams: response.data });
					return response.data;
				},
			}),
			{
				name: "team-store",
				getStorage: () => sessionStorage,
			},
		),
	);
};
