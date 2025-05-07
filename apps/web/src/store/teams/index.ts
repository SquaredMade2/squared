import { persist } from "zustand/middleware";
import { createStore } from "zustand/vanilla";
import type { TeamState, TeamStore } from "./interfaces";
export * from "./interfaces";
export * from "./store";

export const createTeamStore = (
	initState: TeamState = {
		teams: [],
		team: null,
	},
) => {
	return createStore<TeamStore>()(
		persist(
			(set) => ({
				...initState,
				setTeam: (team) => {
					set({ team });
				},
				setTeams: (teams) => set({ teams }),
				createTeam: (team) =>
					set((state) => ({ teams: [...state.teams, team] })),
				updateTeam: (team) =>
					set((state) => ({
						teams: state.teams.map((t) => (t.id === team.id ? team : t)),
					})),
				deleteTeam: (team) =>
					set((state) => ({ teams: state.teams.filter((t) => t.id === team) })),
			}),
			{
				name: "team-storage",
				partialize: (state) => ({ team: state.team }),
			},
		),
	);
};
