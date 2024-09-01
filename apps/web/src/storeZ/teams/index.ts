import { createStore } from "zustand/vanilla";
export * from "./interfaces";
import type { TeamState, TeamStore } from "./interfaces";
import axios from "axios";
import type { Team } from "@repo/db";
import { persist } from "zustand/middleware";
import { useTeamStore } from "../provider";

const apiString = (path: string) =>
	`${process.env.NEXT_PUBLIC_SERVERZ}/api/team/${path}`;

export const createTeamStore = (initState: TeamState = { teams: [] }) => {
	return createStore<TeamStore>()(
		persist(
			(set) => ({
				...initState,
				addTeam: async (team) => {
					const newTeam: Team = await axios.post(apiString(team.id), team);
					const { teams } = useTeamStore();
					set({ teams: [...teams, newTeam] });
					return team;
				},
				getTeam: async (teamId) => {
					const { teams } = useTeamStore();
					const stateTeam = teams.find((t) => t.id === teamId);
					return stateTeam || (await axios.get(apiString(teamId)));
				},
				updateTeam: async (teamId, team) => {
					const updatedTeam: Team = await axios.put(apiString(teamId), team);
					const { teams } = useTeamStore();
					set({ teams: teams.map((t) => (t.id === teamId ? updatedTeam : t)) });
					return updatedTeam;
				},
				deleteTeam: async (teamId) => {
					await axios.delete(apiString(teamId));
					const { teams } = useTeamStore();
					set({ teams: teams.filter((t) => t.id !== teamId) });
				},
				getAllTeams: async (workspaceId) => {
					const teams: Team[] = await axios.get(apiString(workspaceId));
					set({ teams: teams });
					return teams;
				},
			}),
			{
				name: "team-store",
				getStorage: () => sessionStorage,
			},
		),
	);
};
