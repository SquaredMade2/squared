import type { Team } from "@repo/db";

export type TeamState = {
	teams: Team[];
	currentTeam: Team | null;
};

export type TeamActions = {
	addTeam: (team: Team) => Promise<Team>;
	getTeam: (teamId: string) => Promise<Team | undefined> | Team;
	setCurrentTeam: (team: Team) => void;
	updateTeam: (teamId: string, team: Partial<Team>) => Promise<Team>;
	deleteTeam: (teamId: string) => void;
	getAllTeams: (workspaceId: string) => Promise<Team[]>;
};

export type TeamStore = TeamState & TeamActions;
