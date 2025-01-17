import {
	type DBClient,
	type RetrospectiveItemType,
	type Sprint,
	type Task,
	type Team,
	eq,
	sprintsTable,
	teamsTable,
} from "@squared/db";
import createCustomLogger from "@squared/logger";
import { addWeeks } from "date-fns";
import type {
	AddRetrospectivePayload,
	ErrorResponse,
	NextSprintPayload,
	RetroItemReturn,
	RetrospectiveData,
	SprintRpc,
	SprintServiceResponse,
	UpdateRetrospectiveItemPayload,
} from "./types";

export class SprintService implements SprintRpc {
	private logger;
	constructor(private readonly db: DBClient) {
		this.logger = createCustomLogger("sprint-service");
	}

	async getSprints({ teamId }: { teamId: string }): Promise<Sprint[]> {
		this.logger.info("Getting sprints for team", { teamId });
		return this.db
			.select()
			.from(sprintsTable)
			.where(eq(sprintsTable.teamId, teamId));
	}

	async updateSprint({
		sprintId,
		sprintData,
	}: {
		sprintId: string;
		sprintData: Pick<Sprint, "startDate" | "description" | "name" | "endDate">;
	}): Promise<Sprint> {
		this.logger.info("Updating sprint", { sprintId });
		const [updatedSprint] = await this.db
			.update(sprintsTable)
			.set(sprintData)
			.where(eq(sprintsTable.id, sprintId))
			.returning();

		return updatedSprint;
	}

	async initializeSprints({ teamId }: { teamId: string }): Promise<number> {
		this.logger.info("Initializing sprints for team", { teamId });
		return await this.db.transaction(async (tx) => {
			const team = await tx
				.select()
				.from(teamsTable)
				.where(eq(teamsTable.id, teamId))
				.limit(1);

			if (team.length === 0) {
				return 0;
			}

			const allSprints = await tx
				.select()
				.from(sprintsTable)
				.where(eq(sprintsTable.teamId, teamId));

			const pendingSprints = allSprints.filter((s) => s.status === "PLANNED");

			if (pendingSprints.length > 0) {
				await tx
					.update(sprintsTable)
					.set({ status: "ACTIVE" })
					.where(eq(sprintsTable.id, pendingSprints[0].id));
				return pendingSprints.length;
			}

			const sprintDuration = team[0].sprintDuration;

			await tx.insert(sprintsTable).values({
				name: `Sprint ${allSprints.length + 1}`,
				status: "ACTIVE",
				startDate: new Date(),
				endDate: addWeeks(new Date(), sprintDuration),
				teamId,
			});

			return 1;
		});
	}
	async startNextSprint({
		teamId,
		sprintData,
	}: NextSprintPayload): Promise<SprintServiceResponse<Sprint>> {
		this.logger.info("Starting next sprint for team", { teamId });
		const team = await this.db.team.findUnique({ where: { id: teamId } });

		if (!team) {
			return this.sendErrorResponse(404, "Team not found");
		}

		if (!team.sprintsEnabled) {
			return this.sendErrorResponse(
				400,
				"Sprints are not enabled for this team",
			);
		}

		const teamSprints = await this.db.sprint.findMany({
			where: { teamId },
			orderBy: { startDate: "asc" },
		});

		const currentSprint = teamSprints.find((s) => s.status === "ACTIVE");

		await this.completeCurrentSprint(teamSprints);

		const newSprintData = await this.createSprint({
			sprintData,
			team,
			teamSprints,
			teamId,
		});

		await this.db.task.updateMany({
			where: { sprintId: currentSprint?.id, status: { not: "done" } },
			data: { sprintId: newSprintData.id },
		});

		return {
			data: newSprintData,
			message: `Successfully created sprint: ${newSprintData.name}`,
			variant: "default",
		};
	}

	async getSprintTasks({ sprintId }: { sprintId: string }): Promise<Task[]> {
		this.logger.info("Getting tasks for sprint", { sprintId });
		return this.db.task.findMany({ where: { sprintId } });
	}

	async endSprint({ sprintId }: { sprintId: string }): Promise<Sprint> {
		this.logger.info("Ending sprint", { sprintId });
		return this.db.sprint.update({
			where: { id: sprintId },
			data: { status: "COMPLETED" },
		});
	}

	async addRetrospectiveItem({
		sprintId,
		authorId,
		type,
		content,
	}: AddRetrospectivePayload): Promise<RetroItemReturn> {
		this.logger.info("Adding retrospective item", { sprintId, type });
		const sprintRelationField = this.mapTypeToSprintRelationField(
			type,
			sprintId,
		);

		// Create retrospective item with the appropriate relation
		return await this.db.retrospectiveItem.create({
			data: {
				content,
				type,
				authorId,
				...sprintRelationField,
			},
			select: {
				id: true,
				content: true,
				type: true,
				authorId: true,
				likes: true,
			},
		});
	}

	async updateRetrospectiveItem({
		retrospectiveItemId,
		type,
		content,
		sprintId,
	}: UpdateRetrospectiveItemPayload): Promise<RetroItemReturn> {
		this.logger.info("Updating retrospective item", { retrospectiveItemId });

		const sprintRelationField = type
			? this.mapTypeToSprintRelationField(type, sprintId)
			: {};

		const resetFields = {
			wentWellSprintId: null,
			toImproveSprintId: null,
			actionItemsSprintId: null,
			...sprintRelationField,
		};
		// Update the retrospective item with the appropriate relation and content
		return await this.db.retrospectiveItem.update({
			where: { id: retrospectiveItemId },
			data: {
				type,
				content,
				...resetFields,
			},
			select: {
				id: true,
				content: true,
				type: true,
				authorId: true,
				likes: true,
			},
		});
	}

	async likeRetrospectiveItem({
		retrospectiveItemId,
		userId,
	}: {
		retrospectiveItemId: string;
		userId: string;
	}): Promise<RetroItemReturn> {
		this.logger.info("Upvoting retrospective item", {
			retrospectiveItemId,
			userId,
		});
		const retroItem = await this.db.retrospectiveItem.findUnique({
			where: { id: retrospectiveItemId },
		});

		if (!retroItem) {
			throw new Error("Retrospective item not found");
		}

		const updatedLikes = retroItem.likes.includes(userId)
			? retroItem.likes.filter((id) => id !== userId)
			: [...retroItem.likes, userId];

		return this.db.retrospectiveItem.update({
			where: { id: retrospectiveItemId },
			data: { likes: updatedLikes },
			select: {
				id: true,
				content: true,
				type: true,
				authorId: true,
				likes: true,
			},
		});
	}

	async getRetrospectiveItems({
		sprintId,
	}: { sprintId: string }): Promise<RetrospectiveData> {
		this.logger.info("Getting retrospective items for sprint", { sprintId });
		const [wentWell, toImprove, actionItems] = await Promise.all([
			this.db.retrospectiveItem.findMany({
				where: { wentWellSprintId: sprintId },
			}),
			this.db.retrospectiveItem.findMany({
				where: { toImproveSprintId: sprintId },
			}),
			this.db.retrospectiveItem.findMany({
				where: { actionItemsSprintId: sprintId },
			}),
		]);

		return { wentWell, toImprove, actionItems };
	}

	private sendErrorResponse(status: number, message: string): ErrorResponse {
		return {
			status,
			message,
			variant: "destructive",
		};
	}

	private mapTypeToSprintRelationField(
		type: RetrospectiveItemType,
		sprintId: string,
	): Record<string, string> {
		this.logger.info("Mapping retrospective type to sprint relation field", {
			type,
			sprintId,
		});
		switch (type) {
			case "wentWell":
				return { wentWellSprintId: sprintId };
			case "toImprove":
				return { toImproveSprintId: sprintId };
			case "actionItems":
				return { actionItemsSprintId: sprintId };
			default:
				throw new Error(`Unknown retrospective type: ${type}`);
		}
	}

	private async completeCurrentSprint(teamSprints: Sprint[]): Promise<void> {
		const activeSprintIds = teamSprints
			.filter((s) => s.status === "ACTIVE")
			.map((s) => s.id);

		await this.db.sprint.updateMany({
			where: { id: { in: activeSprintIds } },
			data: { status: "COMPLETED" },
		});
	}

	private async createSprint({
		team,
		teamSprints,
		teamId,
		sprintData,
	}: {
		team: Team;
		teamSprints: Sprint[];
		teamId: string;
		sprintData: NextSprintPayload["sprintData"];
	}): Promise<Sprint> {
		const sprintDuration = team.sprintDuration;

		return await this.db.sprint.create({
			data: {
				name: `Sprint ${teamSprints.length + 1}`,
				startDate: new Date(),
				endDate: addWeeks(new Date(), sprintDuration),
				status: "ACTIVE",
				teamId,
				...sprintData,
			},
		});
	}
}
