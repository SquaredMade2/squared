import type { Sprint, Team } from "@squared/db";

export type TeamState = {
	teams: Team[];
	currentTeam: Team | null;
	sprints: Sprint[];
	currentSprint: Sprint | null;
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
	setCurrentSprint: (sprint: Sprint) => void;
};

export type TeamStore = TeamState & TeamActions;
