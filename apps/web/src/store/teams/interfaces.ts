import type { Team } from "@squared/db";

export type TeamState = {
	teams: Team[];
	currentTeam: Team | null;
};

type TeamActions = {
	setCurrentTeam: (team: Team) => void;
	setTeams: (teams: Team[]) => void;
	updateTeam: (team: Team) => void;
	createTeam: (team: Team) => void;
	deleteTeam: (teamId: string) => Promise<void>;
	getAllTeams: (workspaceId: string) => Promise<Team[]>;
};

export type TeamStore = TeamState & TeamActions;
