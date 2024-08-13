import type { Team } from "@repo/db";

export type TeamActions = {
	addTeam: (team: Team) => (state: TeamState) => TeamState;
};

export type TeamState = {
	teams: Team[];
};

export type TeamStore = TeamActions & TeamState;
