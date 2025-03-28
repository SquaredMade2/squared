import type { Team } from "@squaredmade/db";

export type TeamState = {
	teams: Team[];
	team: Team | null;
};

type TeamActions = {
	setTeam: (team: Team | null) => void;
	setTeams: (teams: Team[]) => void;
	updateTeam: (team: Team) => void;
	createTeam: (team: Team) => void;
	deleteTeam: (teamId: string) => void;
};

export type TeamStore = TeamState & TeamActions;
