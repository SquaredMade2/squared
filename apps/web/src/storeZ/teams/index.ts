import { createStore } from "zustand/vanilla";
export * from "./interfaces";
import type { TeamState, TeamStore } from "./interfaces";
import axios from "axios";
import type { Team } from "@repo/db";
import { persist } from "zustand/middleware";

const apiString = (path: string) =>
	`${process.env.NEXT_PUBLIC_SERVERZ}/api/team/${path}`;

export const createTeamStore = (initState: TeamState = { teams: [] }) => {
	return createStore<TeamStore>()(
		persist(
			(set) => ({
				...initState,
				addTeam: (team) => async (state) => {
					const newTeam: Team = await axios.post(apiString(team.id), team);
					newTeam &&
						set({
							teams: [...state.teams, newTeam],
						});
					return team;
				},
				getTeam: (teamId) => async (state) => {
					const stateTeam = state.teams.find((t) => t.id === teamId);
					return stateTeam || (await axios.get(apiString(teamId)));
				},
				updateTeam: (teamId, team) => async (state) => {
					const updatedTeam: Team = await axios.put(apiString(teamId), team);
					set({
						teams: state.teams.map((t) => (t.id === teamId ? updatedTeam : t)),
					});
					return updatedTeam;
				},
				deleteTeam: (teamId) => (state) => {
					axios.delete(apiString(teamId));
					set({
						teams: state.teams.filter((t) => t.id !== teamId),
					});
				},
				getAllTeams: (workspaceId) => async () => {
					const teams: Team[] = await axios.get(apiString(workspaceId));
					set({
						teams: teams,
					});
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
