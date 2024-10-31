import type { Sprint, Team, RetrospectiveItem } from "@squared/db";

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
export interface RetrospectiveItemResponse {
	item: RetrospectiveItem | null;
	message?: string;
	variant: "default" | "destructive";
}

export type InitializeSprintsBody = {
	count?: number;
	startDate?: Date;
};

export type RetrospectiveData = {
	wentWell: RetrospectiveItem[];
	toImprove: RetrospectiveItem[];
	actionItems: RetrospectiveItem[];
};

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
