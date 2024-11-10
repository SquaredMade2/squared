import type { Sprint, Team } from "@squared/db";

export type TeamState = {
	teams: Team[];
	currentTeam: Team | null;
	sprints: Sprint[];
	currentSprint: Sprint | null;
};

type TeamActions = {
	setCurrentTeam: (team: Team) => void;
	setTeams: (teams: Team[]) => void;
	updateTeam: (team: Team) => void;
	createTeam: (team: Team) => void;
};

export type TeamStore = TeamState & TeamActions;
