import { persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";
import type { TeamState, TeamStore } from "./interfaces";

export type { TeamState, TeamStore } from "./interfaces";
export { TeamStoreProvider, useTeamStore } from "./store";

export const createTeamStore = (
	initState: TeamState = {
		team: null,
		teams: [],
	},
) => {
	return createStore<TeamStore>()(
		persist(
			(set) => ({
				...initState,
				createTeam: (team) =>
					set((state) => ({ teams: [...state.teams, team] })),
				deleteTeam: (team) =>
					set((state) => ({ teams: state.teams.filter((t) => t.id === team) })),
				setTeam: (team) => {
					set({ team });
				},
				setTeams: (teams) => set({ teams }),
				updateTeam: (team) =>
					set((state) => ({
						teams: state.teams.map((t) => (t.id === team.id ? team : t)),
					})),
			}),
			{
				name: "team-storage",
				partialize: (state) => ({ team: state.team }),
			},
		),
	);
};
