import type { Team } from "@repo/db";
import type { TeamActions, TeamState, TeamStore } from "./interfaces.ts";
import axios from "axios";

const apiString = (path: string, workspaceId: string) => {
	return `${process.env.SERVER_URL}/api/workspace/${workspaceId}/${path}`;
};

export const teamActions: TeamActions = {
	addTeam: (team: Team) => (state: TeamState) => {
		return {
			...state,
			teams: [...state.teams, team],
		};
	},
};

export const teamState: TeamState = {
	teams: [],
};

export const initTeamState: TeamStore = {
	...teamState,
	...teamActions,
};
