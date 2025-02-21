import {
	type DBClient,
	type Team,
	and,
	eq,
	teamsTable,
	userTeamsTable,
} from "@squared/db";
import type { Logger } from "@squared/logger";
import createCustomLogger from "@squared/logger";
import type {
	CreateTeamParams,
	TeamRpc,
	UpdateTeamParams,
	UpdateTeamSprintsParams,
} from "./types";

export class TeamService implements TeamRpc {
	private readonly db: DBClient;
	private readonly logger: Logger;

	constructor(db: DBClient) {
		this.db = db;
		this.logger = createCustomLogger("team");
	}

	async createTeam({
		name,
		identifier,
		workspaceId,
		userId,
	}: CreateTeamParams): Promise<Team> {
		this.logger.info("Creating team", { name, identifier, workspaceId });

		return await this.db.transaction(async (tx) => {
			// Check if team already exists
			const existingTeam = await tx
				.select()
				.from(teamsTable)
				.where(eq(teamsTable.identifier, identifier))
				.limit(1);

			if (existingTeam.length > 0) {
				throw new Error("Team already exists");
			}

			// Create the team
			const [createdTeam] = await tx
				.insert(teamsTable)
				.values({
					name,
					identifier,
					workspaceId,
				})
				.returning();

			if (!createdTeam) {
				throw new Error("Failed to create team");
			}

			// Create user-team association
			await tx.insert(userTeamsTable).values({
				userId,
				teamId: createdTeam.id,
			});

			return createdTeam;
		});
	}

	async updateTeam({ id, ...args }: UpdateTeamParams): Promise<Team> {
		this.logger.info("Updating team", id);
		return await this.db.transaction(async (tx) => {
			const [updatedTeam] = await tx
				.update(teamsTable)
				.set(args)
				.where(eq(teamsTable.id, id))
				.returning();

			if (!updatedTeam) {
				throw new Error("Team not found");
			}

			return updatedTeam;
		});
	}

	async updateTeamSprints({
		id,
		...args
	}: UpdateTeamSprintsParams): Promise<Team> {
		this.logger.info("Updating team sprints", id);
		return await this.db.transaction(async (tx) => {
			const [updatedTeam] = await tx
				.update(teamsTable)
				.set(args)
				.where(eq(teamsTable.id, id))
				.returning();

			if (!updatedTeam) {
				throw new Error("Team not found");
			}

			return updatedTeam;
		});
	}

	async deleteTeam({ teamId }: { teamId: string }): Promise<Team> {
		this.logger.info("Deleting team", teamId);
		return await this.db.transaction(async (tx) => {
			const [result] = await tx
				.delete(teamsTable)
				.where(eq(teamsTable.id, teamId))
				.returning();

			if (!result) {
				throw new Error("Team not found");
			}
			return result;
		});
	}

	async getTeam({ teamId }: { teamId: string }): Promise<Team | null> {
		this.logger.info("Finding team", teamId);
		return await this.db.transaction(async (tx) => {
			const team = await tx
				.select()
				.from(teamsTable)
				.where(eq(teamsTable.id, teamId))
				.limit(1)
				.then((results) => results[0] || null);

			return team;
		});
	}

	async getTeamByIdentifier({
		identifier,
		workspaceId,
	}: {
		identifier: string;
		workspaceId: string;
	}): Promise<Team | null> {
		this.logger.info("Finding team: ", identifier);
		return await this.db.transaction(async (tx) => {
			const team = await tx
				.select()
				.from(teamsTable)
				.where(
					and(
						eq(teamsTable.identifier, identifier),
						eq(teamsTable.workspaceId, workspaceId),
					),
				)
				.limit(1)
				.then((results) => results[0] || null);

			return team;
		});
	}

	async getUserTeams({
		userId,
		workspaceId,
	}: { userId: string; workspaceId: string }): Promise<Team[]> {
		this.logger.info("Finding teams for user: ", userId);
		return await this.db
			.select()
			.from(teamsTable)
			.leftJoin(userTeamsTable, eq(teamsTable.id, userTeamsTable.teamId))
			.where(
				and(
					eq(userTeamsTable.userId, userId),
					eq(teamsTable.workspaceId, workspaceId),
				),
			)
			.then((results) => results.map((t) => t.Team));
	}

	async getWorkspaceTeams({
		workspaceId,
	}: { workspaceId: string }): Promise<Team[]> {
		this.logger.info("Finding workspace teams");

		return await this.db.transaction(async (tx) => {
			const teams = await tx
				.select()
				.from(teamsTable)
				.where(eq(teamsTable.workspaceId, workspaceId));

			return teams;
		});
	}

	async removeUserFromTeam({
		userId,
		teamId,
	}: {
		userId: string;
		teamId: string;
	}): Promise<{ success: boolean }> {
		this.logger.info("Removing user from team");

		return await this.db.transaction(async (tx) => {
			const result = await tx
				.delete(userTeamsTable)
				.where(
					and(
						eq(userTeamsTable.userId, userId),
						eq(userTeamsTable.teamId, teamId),
					),
				)
				.returning();

			if (result.length === 0) {
				throw new Error("User-team association not found");
			}

			return { success: true };
		});
	}
}
