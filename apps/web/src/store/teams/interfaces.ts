import type { Sprint, Team } from "@repo/db";

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

export interface SprintResponse {
	sprint: Sprint | null;
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
	createSprint: (
		teamId: string,
		sprint: Partial<Sprint>,
	) => Promise<SprintResponse>;
	getSprints: (teamId: string) => Promise<Sprint[]>;
	updateSprint: (
		sprintId: string,
		sprint: Partial<Sprint>,
	) => Promise<SprintResponse>;
	setCurrentSprint: (sprint: Sprint) => void;
};

export type TeamStore = TeamState & TeamActions;
