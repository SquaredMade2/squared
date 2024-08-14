import type { Team } from "@repo/db";

export type TeamState = {
  teams: Team[];
};

export type TeamActions = {
  addTeam: (team: Team) => (state: TeamState) => Team;
};

export type TeamStore = TeamState & TeamActions;
