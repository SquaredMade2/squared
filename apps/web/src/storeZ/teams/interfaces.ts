import type { Team } from "@repo/db";

export type TeamState = {
	teams: Team[];
};

export type TeamActions = {
	addTeam: (team: Team) => (state: TeamState) => Promise<Team>;
	getTeam: (
		teamId: string,
	) => (state: TeamState) => Promise<Team | undefined> | Team;
	updateTeam: (
		teamId: string,
		team: Partial<Team>,
	) => (state: TeamState) => Promise<Team>;
	deleteTeam: (teamId: string) => (state: TeamState) => void;
	getAllTeams: (workspaceId: string) => (state: TeamState) => Promise<Team[]>;
};

export type TeamStore = TeamState & TeamActions;
