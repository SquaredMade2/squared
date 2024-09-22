import type { Team } from "@repo/db";

export type TeamState = {
	teams: Team[];
	currentTeam: Team | null;
};

export interface TeamResponse {
	team: Team | null;
	message?: string;
	variant: "default" | "destructive";
}

type TeamActions = {
	addTeam: (team: Partial<Team>) => Promise<TeamResponse>;
	getTeam: (teamId: string) => Promise<TeamResponse>;
	setCurrentTeam: (team: Team) => void;
	updateTeam: (teamId: string, team: Partial<Team>) => Promise<TeamResponse>;
	deleteTeam: (teamId: string) => Promise<void>;
	getAllTeams: (workspaceId: string) => Promise<Team[]>;
};

export type TeamStore = TeamState & TeamActions;
