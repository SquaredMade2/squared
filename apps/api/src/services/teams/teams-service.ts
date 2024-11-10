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

		const newTeam = await this.db.team.create({
			data: {
				name,
				identifier,
				workspaceId,
			},
		});

		return newTeam;
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
		const team: Team | null = await this.db.team.delete({
			where: { id: teamId },
		});

		if (!team) {
			throw new Error("Team not found");
		}

		return;
	}

	async getTeam({ teamId }: { teamId: string }): Promise<Team> {
		this.logger.info("Finding team: %s", teamId);
		const team: Team | null = await this.db.team.findFirst({
			where: { id: teamId },
		});

		if (!team) {
			throw new Error("Team not found");
		}

		return team;
	}
}
