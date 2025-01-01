import type { Effort, Team } from "@squared/db";

export type CreateTeamParams = {
	name: string;
	identifier: string;
	workspaceId: string;
};

export type UpdateTeamParams = {
	id: string;
	name: string;
	identifier: string;
	effort: Effort;
};

export type UpdateTeamSprintsParams = {
	id: string;
	sprintsEnabled?: boolean;
	sprintDuration?: number;
	cooldownDuration?: number;
	sprintStartDate?: Date;
};

export interface TeamRpc {
	createTeam: (args: CreateTeamParams) => Promise<Team>;
	updateTeam: (args: UpdateTeamParams) => Promise<Team>;
	updateTeamSprints: (args: UpdateTeamSprintsParams) => Promise<Team>;
	deleteTeam: (args: { teamId: string }) => Promise<void>;
	getTeam: (args: { teamId: string }) => Promise<Team | null>;
	getTeamByIdentifier: (args: {
		identifier: string;
		workspaceId: string;
	}) => Promise<Team | null>;
	getUserTeams: (args: { userId: string; workspaceId: string }) => Promise<
		Team[]
	>;
	addUserToTeam: (args: { userId: string, teamId: string, }) => Promise<void>;
	removeUserFromTeam: (args: {
		userId: string;
		teamId: string;
	}) => Promise<void>;
}
