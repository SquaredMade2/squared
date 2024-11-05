import type {
	PrismaClient,
	RetrospectiveItemType,
	Sprint,
	Task,
	Team,
} from "@squared/db";
import createCustomLogger from "@squared/logger";
import { addWeeks } from "date-fns";
import type {
	AddRetrospectivePayload,
	ErrorResponse,
	RetroItemReturn,
	RetrospectiveData,
	SprintRpc,
	SprintServiceResponse,
	UpdateRetrospectiveItemPayload,
} from "./types";

interface StartNextSprintInput {
	teamId: string;
	movedTasks: string[];
	sprintData?: {
		id?: string;
		name?: string;
	};
}

export class SprintService implements SprintRpc {
	private logger;
	constructor(private readonly db: PrismaClient) {
		this.logger = createCustomLogger("sprint-service");
	}

	async getSprints({ teamId }: { teamId: string }): Promise<Sprint[]> {
		this.logger.info("Getting sprints for team", { teamId });
		return this.db.sprint.findMany({ where: { teamId } });
	}

	async updateSprint({
		sprintId,
		sprintData,
	}: {
		sprintId: string;
		sprintData: Pick<Sprint, "startDate" | "description" | "name" | "endDate">;
	}): Promise<Sprint> {
		return this.db.sprint.update({
			where: { id: sprintId },
			data: sprintData,
		});
	}

	async initializeSprints({ teamId }: { teamId: string }): Promise<number> {
		this.logger.info("Initializing sprints for team", { teamId });
		const team = await this.db.team.findUnique({ where: { id: teamId } });

		if (!team) {
			return 0;
		}

		const sprints = await this.db.sprint.findMany({ where: { teamId } });
		const pendingSprints = sprints.filter((s) => s.status === "PLANNED");
		const remainingSprints = Math.max(
			0,
			team.upcomingSprints - pendingSprints.length,
		);

		if (remainingSprints <= 0) {
			return pendingSprints.length;
		}

		const sprintDuration = team.sprintDuration;

		const newSprints: Pick<
			Sprint,
			"name" | "status" | "startDate" | "endDate" | "teamId"
		>[] = Array.from({ length: remainingSprints }, (_, index) => {
			const startDate = addWeeks(new Date(), index * sprintDuration);
			const endDate = addWeeks(startDate, sprintDuration);

			return {
				name: `Sprint ${sprints.length + index + 1}`,
				status: "PLANNED",
				startDate,
				endDate,
				teamId,
			};
		});
		await this.db.sprint.createMany({ data: newSprints });

		return 1;
	}

	async startNextSprint({
		teamId,
		movedTasks,
		sprintData,
	}: StartNextSprintInput): Promise<SprintServiceResponse<Sprint>> {
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

		const newSprintData = await this.createOrUpdateSprint({
			sprintData,
			team,
			teamSprints,
			teamId,
		});

		await this.updateTasksForNewSprint(
			movedTasks,
			currentSprint?.id || null,
			newSprintData.id,
		);

		await this.resetIncompleteTasks(currentSprint?.id || null);

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
				...sprintRelationField,
			},
			select: { id: true, content: true, type: true },
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

		// Update the retrospective item with the appropriate relation and content
		return await this.db.retrospectiveItem.update({
			where: { id: retrospectiveItemId },
			data: {
				content,
				type,
				...sprintRelationField,
			},
			select: { id: true, content: true, type: true },
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

	private async createOrUpdateSprint({
		team,
		teamSprints,
		teamId,
		sprintData,
	}: {
		team: Team;
		teamSprints: Sprint[];
		teamId: string;
		sprintData: StartNextSprintInput["sprintData"];
	}): Promise<Sprint> {
		const sprintDuration = team.sprintDuration;

		if (sprintData?.id) {
			return await this.db.sprint.update({
				where: { id: sprintData.id },
				data: {
					status: "ACTIVE",
					startDate: new Date(),
					endDate: addWeeks(new Date(), sprintDuration),
					teamId,
					...sprintData,
				},
			});
		}

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

	private async updateTasksForNewSprint(
		movedTasks: string[],
		currentSprintId: string | null,
		newSprintId: string,
	): Promise<void> {
		await this.db.task.updateMany({
			where: {
				id: { in: movedTasks },
				sprintId: currentSprintId,
			},
			data: { sprintId: newSprintId },
		});
	}

	private async resetIncompleteTasks(
		currentSprintId: string | null,
	): Promise<void> {
		await this.db.task.updateMany({
			where: {
				sprintId: currentSprintId,
				status: { not: "done" },
			},
			data: { sprintId: null },
		});
	}
}
