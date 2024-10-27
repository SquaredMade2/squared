import type { PrismaClient, Sprint, Task, Team } from "@squared/db";
import type {
	AddRetrospectivePayload,
	ErrorResponse,
	RetrospectiveData,
	RetrospectiveItemType,
	SprintRpc,
	SprintServiceResponse,
	UpdateRetrospectiveItemPayload,
} from "./types";
import { addWeeks } from "date-fns";

// Define error response structure

interface StartNextSprintInput {
	teamId: string;
	movedTasks: string[];
	sprintData?: {
		id?: string;
		name?: string;
	};
}

export class SprintService implements SprintRpc {
	constructor(private readonly db: PrismaClient) {}

	async getSprints(teamId: string): Promise<Sprint[]> {
		return this.db.sprint.findMany({ where: { teamId } });
	}

	async startNextSprint({
		teamId,
		movedTasks,
		sprintData,
	}: StartNextSprintInput): Promise<SprintServiceResponse<Sprint>> {
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

	async getSprintTasks(sprintId: string): Promise<Task[]> {
		return this.db.task.findMany({ where: { sprintId } });
	}

	async endSprint(sprintId: string): Promise<Sprint> {
		return this.db.sprint.update({
			where: { id: sprintId },
			data: { status: "COMPLETED" },
		});
	}

	async addRetrospectiveItem({
		sprintId,
		type,
		content,
	}: AddRetrospectivePayload): Promise<void> {
		const sprintRelationField = this.mapTypeToSprintRelationField(
			type,
			sprintId,
		);

		// Create retrospective item with the appropriate relation
		await this.db.retrospectiveItem.create({
			data: {
				content,
				type,
				...sprintRelationField,
			},
		});
	}

	async updateRetrospectiveItem({
		retrospectiveItemId,
		type,
		content,
		sprintId,
	}: UpdateRetrospectiveItemPayload): Promise<void> {
		const sprintRelationField = this.mapTypeToSprintRelationField(
			type,
			sprintId,
		);

		// Update the retrospective item with the appropriate relation and content
		await this.db.retrospectiveItem.update({
			where: { id: retrospectiveItemId },
			data: {
				content,
				type,
				...sprintRelationField,
			},
		});
	}

	async getRetrospectiveItems(sprintId: string): Promise<RetrospectiveData> {
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
