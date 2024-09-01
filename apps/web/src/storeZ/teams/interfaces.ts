import type { Team } from "@repo/db";

export type TeamState = {
	teams: Team[];
};

export type TeamActions = {
	addTeam: (team: Team) => Promise<Team>;
	getTeam: (teamId: string) => Promise<Team | undefined> | Team;
	updateTeam: (teamId: string, team: Partial<Team>) => Promise<Team>;
	deleteTeam: (teamId: string) => void;
	getAllTeams: (workspaceId: string) => Promise<Team[]>;
};

export type TeamStore = TeamState & TeamActions;
