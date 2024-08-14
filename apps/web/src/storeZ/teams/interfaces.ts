import type { Team } from "@repo/db";

export type TeamState = {
  teams: Team[];
};

export type TeamActions = {
  addTeam: (team: Team) => (state: TeamState) => Promise<Team>;
  getTeam: (
    teamId: string
  ) => (state: TeamState) => Promise<Team> | Team | undefined;
};

export type TeamStore = TeamState & TeamActions;
