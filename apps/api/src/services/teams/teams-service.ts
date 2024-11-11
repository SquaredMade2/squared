import type { PrismaClient, Team } from "@squared/db";
import type { Logger } from "@squared/logger";
import createCustomLogger from "@squared/logger";
import type { CreateTeamParams, TeamRpc, UpdateTeamParams } from "./types";

export class TeamService implements TeamRpc {
	private readonly db: PrismaClient;
	private readonly logger: Logger;

	constructor(db: PrismaClient) {
		this.db = db;
		this.logger = createCustomLogger("team");
	}

	async createTeam({
		name,
		identifier,
		workspaceId,
	}: CreateTeamParams): Promise<Team> {
		this.logger.info("Creating team: %0", { name, identifier, workspaceId });
		const existingTeam = await this.db.team.findFirst({
			where: { identifier },
		});

		if (existingTeam) {
			throw new Error("Team already exists");
		}

		return await this.db.team.create({
			data: {
				name,
				identifier,
				workspaceId,
			},
		});
	}

	async updateTeam(args: UpdateTeamParams): Promise<Team> {
		this.logger.info("Updating team: %s", args.id);
		const team: Team | null = await this.db.team.update({
			where: { id: args.id },
			data: args,
		});

		if (!team) {
			throw new Error("There was an issue updating the team");
		}

		// Return the updated team
		return team;
	}

	async deleteTeam({ teamId }: { teamId: string }): Promise<void> {
		this.logger.info("Deleting team: %s", teamId);
		await this.db.team.delete({
			where: { id: teamId },
		});
	}

	async getTeam({ teamId }: { teamId: string }): Promise<Team | null> {
		this.logger.info("Finding team: %s", teamId);
		return await this.db.team.findUnique({
			where: { id: teamId },
		});
	}

	async getTeamByIdentifier({
		identifier,
	}: { identifier: string }): Promise<Team | null> {
		this.logger.info("Finding team: %s", identifier);
		return await this.db.team.findFirst({ where: { identifier } });
	}

	async getUserTeams({
		userId,
		workspaceId,
	}: { userId: string; workspaceId: string }): Promise<Team[]> {
		this.logger.info("Finding teams for user: %0", userId);
		const teamIds = await this.db.userTeam
			.findMany({ where: { userId } })
			.then((t) => t.map((ut) => ut.teamId));

		return await this.db.team.findMany({
			where: { workspaceId, id: { in: teamIds } },
		});
	}
}
