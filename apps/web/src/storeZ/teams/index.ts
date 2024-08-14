import { createStore } from "zustand/vanilla";
export * from "./interfaces";
import type { TeamState, TeamStore } from "./interfaces";

export const createTeamStore = (
  initState: TeamState = { teams: [] }
) => {
  return createStore<TeamStore>()((set) => ({
    ...initState,
    addTeam: (team) => (state) => {
      set({
        teams: [...state.teams, team],
      });
      return team;
    },
  }));
};
