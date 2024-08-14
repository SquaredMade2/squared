import { createStore } from "zustand/vanilla";
import type { Team } from "@repo/db";

export type TeamState = {
  teams: Team[];
};

export type TeamActions = {
  addTeam: (team: Team) => void;
};

export type TeamStore = TeamState & TeamActions;

export const createTeamStore = (
  initState: TeamState = { teams: [] }
) => {
  return createStore<TeamStore>()((set) => ({
    ...initState,
    addTeam: (team) => {
      set((state) => ({
        teams: [...state.teams, team],
      }));
    },
  }));
};
