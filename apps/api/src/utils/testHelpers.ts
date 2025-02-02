import { db } from "@/api/app";
import {
	type Team,
	type User,
	type Workspace,
	eq,
	teamsTable,
	userTeamsTable,
} from "@squared/db";
import type { Response } from "supertest";

// so we can type the response.body property
// https://github.com/ladjs/supertest/issues/720#issuecomment-1461919727
export type SuperResponse<T> = Omit<Response, "body"> & { body: T };

// query the seeded database to retrieve a useable team/user combo
export async function getUserAndTeamIDs() {
	const teams = await db
		.select()
		.from(teamsTable)
		.leftJoin(userTeamsTable, eq(teamsTable.id, userTeamsTable.teamId));
	if (teams.length === 0) {
		throw new Error("no teams detected");
	}

	const team = teams[0];
	if (!team.UserTeam) {
		throw new Error("no users detected");
	}

	return { teamId: team.Team.id, userId: team.UserTeam.userId };
}

// Dates sent via rpc are serialized and so are not instances of the Date class, but
// dates retrieved from drizzle are instances of the date class. So dates from the date class
// need to be serialized to an ISO string to allow deep object comparison.
export function serializeUserDates(user: User) {
	return {
		...user,
		createdAt: user.createdAt.toISOString(),
		lastLogin: user.lastLogin.toISOString(),
	};
}
export function serializeTeamDates(team: Team) {
	return {
		...team,
		sprintStartDate: team.sprintStartDate.toISOString(),
	};
}
export function serializeWorkspaceDates(workspace: Workspace) {
	return {
		...workspace,
		createdAt: workspace.createdAt.toISOString(),
	};
}

export function sortById<T extends { id: string }>(array: T[]) {
	return array.sort((a, b) => a.id.localeCompare(b.id));
}
