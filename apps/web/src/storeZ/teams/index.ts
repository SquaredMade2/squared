import { createStore } from "zustand/vanilla";
export * from "./interfaces";
import type { TeamState, TeamStore } from "./interfaces";
import axios from "axios";
import type { Team } from "@repo/db";

const apiString = (path: string) =>
	`${process.env.SERVER_URL}/api/team/${path}`;

export const createTeamStore = (initState: TeamState = { teams: [] }) => {
	return createStore<TeamStore>()((set) => ({
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
	}));
};
