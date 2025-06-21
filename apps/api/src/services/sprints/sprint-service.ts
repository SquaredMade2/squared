import {
	and,
	type DBClient,
	desc,
	eq,
	inArray,
	ne,
	retrospectiveItemsTable,
	type Sprint,
	sprintsTable,
	type Task,
	type Team,
	type TransactionClient,
	tasksTable,
	teamsTable,
} from "@squaredmade/db";
import createCustomLogger from "@squaredmade/logger";
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
	private db: DBClient;
	constructor(db: DBClient) {
		this.db = db;
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
				endDate: addWeeks(new Date(), sprintDuration),
				name: `Sprint ${allSprints.length + 1}`,
				startDate: new Date(),
				status: "ACTIVE",
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
		return await this.db.transaction(async (tx) => {
			const team = await tx
				.select()
				.from(teamsTable)
				.where(eq(teamsTable.id, teamId))
				.limit(1);

			if (team.length === 0) {
				return this.sendErrorResponse(404, "Team not found");
			}

			if (!team[0].sprintsEnabled) {
				return this.sendErrorResponse(
					400,
					"Sprints are not enabled for this team",
				);
			}

			const teamSprints = await tx
				.select()
				.from(sprintsTable)
				.where(eq(sprintsTable.teamId, teamId))
				.orderBy(desc(sprintsTable.startDate));

			const currentSprint = teamSprints.find((s) => s.status === "ACTIVE");

			await this.completeCurrentSprint(tx, teamSprints);

			const newSprintData = await this.createSprint({
				sprintData,
				team: team[0],
				teamId,
				teamSprints,
				tx,
			});

			if (currentSprint) {
				const updatedTasks = await tx
					.update(tasksTable)
					.set({ sprintId: newSprintData.id })
					.where(
						and(
							eq(tasksTable.sprintId, currentSprint.id),
							ne(tasksTable.status, "done"),
							ne(tasksTable.status, "canceled"),
							ne(tasksTable.status, "duplicated"),
							ne(tasksTable.status, "archived"),
						),
					)
					.returning({ id: tasksTable.id });

				await tx
					.update(tasksTable)
					.set({ sprintId: newSprintData.id })
					.where(
						and(
							eq(tasksTable.sprintId, currentSprint.id),
							ne(tasksTable.status, "done"),
							ne(tasksTable.status, "canceled"),
							ne(tasksTable.status, "duplicated"),
							ne(tasksTable.status, "archived"),
							inArray(
								tasksTable.parentId,
								updatedTasks.map((t) => t.id),
							),
						),
					);
			}

			return {
				data: newSprintData,
				message: `Successfully created sprint: ${newSprintData.name}`,
				variant: "default",
			};
		});
	}

	async getSprintTasks({ sprintId }: { sprintId: string }): Promise<Task[]> {
		this.logger.info("Getting tasks for sprint", { sprintId });
		return this.db
			.select()
			.from(tasksTable)
			.where(eq(tasksTable.sprintId, sprintId));
	}

	async endSprint({ sprintId }: { sprintId: string }): Promise<Sprint> {
		this.logger.info("Ending sprint", { sprintId });
		const [endedSprint] = await this.db
			.update(sprintsTable)
			.set({ status: "COMPLETED" })
			.where(eq(sprintsTable.id, sprintId))
			.returning();
		return endedSprint;
	}

	async addRetrospectiveItem({
		sprintId,
		authorId,
		type,
		content,
	}: AddRetrospectivePayload): Promise<RetroItemReturn> {
		this.logger.info("Adding retrospective item", { sprintId, type });

		const [newItem] = await this.db
			.insert(retrospectiveItemsTable)
			.values({
				authorId,
				content,
				sprintId,
				type,
			})
			.returning({
				authorId: retrospectiveItemsTable.authorId,
				content: retrospectiveItemsTable.content,
				createdAt: retrospectiveItemsTable.createdAt,
				id: retrospectiveItemsTable.id,
				likes: retrospectiveItemsTable.likes,
				type: retrospectiveItemsTable.type,
			});

		return newItem;
	}

	async updateRetrospectiveItem({
		retrospectiveItemId,
		type,
		content,
		sprintId,
	}: UpdateRetrospectiveItemPayload): Promise<RetroItemReturn> {
		this.logger.info("Updating retrospective item", { retrospectiveItemId });

		const [updatedItem] = await this.db
			.update(retrospectiveItemsTable)
			.set({
				content,
				sprintId,
				type,
			})
			.where(eq(retrospectiveItemsTable.id, retrospectiveItemId))
			.returning({
				authorId: retrospectiveItemsTable.authorId,
				content: retrospectiveItemsTable.content,
				createdAt: retrospectiveItemsTable.createdAt,
				id: retrospectiveItemsTable.id,
				likes: retrospectiveItemsTable.likes,
				type: retrospectiveItemsTable.type,
			});

		return updatedItem;
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

		const [retroItem] = await this.db
			.select()
			.from(retrospectiveItemsTable)
			.where(eq(retrospectiveItemsTable.id, retrospectiveItemId))
			.limit(1);

		if (!retroItem) {
			throw new Error("Retrospective item not found");
		}

		const updatedLikes = retroItem.likes.includes(userId)
			? retroItem.likes.filter((id) => id !== userId)
			: [...retroItem.likes, userId];

		const [updatedItem] = await this.db
			.update(retrospectiveItemsTable)
			.set({ likes: updatedLikes })
			.where(eq(retrospectiveItemsTable.id, retrospectiveItemId))
			.returning({
				authorId: retrospectiveItemsTable.authorId,
				content: retrospectiveItemsTable.content,
				createdAt: retrospectiveItemsTable.createdAt,
				id: retrospectiveItemsTable.id,
				likes: retrospectiveItemsTable.likes,
				type: retrospectiveItemsTable.type,
			});

		return updatedItem;
	}

	async getRetrospectiveItems({
		sprintId,
	}: {
		sprintId: string;
	}): Promise<RetrospectiveData> {
		this.logger.info("Getting retrospective items for sprint", { sprintId });
		const items = await this.db
			.select()
			.from(retrospectiveItemsTable)
			.where(eq(retrospectiveItemsTable.sprintId, sprintId));

		return {
			actionItems: items.filter((ri) => ri.type === "actionItems"),
			toImprove: items.filter((ri) => ri.type === "toImprove"),
			wentWell: items.filter((ri) => ri.type === "wentWell"),
		};
	}

	private sendErrorResponse(status: number, message: string): ErrorResponse {
		return {
			message,
			status,
			variant: "destructive",
		};
	}

	private async completeCurrentSprint(
		tx: TransactionClient,
		teamSprints: Sprint[],
	): Promise<void> {
		const currentSprint = teamSprints.find((s) => s.status === "ACTIVE");
		if (currentSprint) {
			await tx
				.update(sprintsTable)
				.set({ status: "COMPLETED" })
				.where(eq(sprintsTable.id, currentSprint.id));
		}
	}

	private async createSprint({
		tx,
		team,
		teamSprints,
		teamId,
		sprintData,
	}: {
		tx: TransactionClient;
		team: Team;
		teamSprints: Sprint[];
		teamId: string;
		sprintData: NextSprintPayload["sprintData"];
	}): Promise<Sprint> {
		const lastSprint = teamSprints[0];
		const newSprintNumber =
			(lastSprint ? Number.parseInt(lastSprint.name.split(" ")[1]) : 0) + 1;
		const startDate = new Date();
		const endDate = new Date(startDate);
		endDate.setDate(endDate.getDate() + team.sprintDuration * 7);

		const [newSprint] = await tx
			.insert(sprintsTable)
			.values({
				endDate,
				name: `Sprint ${newSprintNumber}`,
				startDate,
				status: "ACTIVE",
				teamId,
				...sprintData,
			})
			.returning();

		return newSprint;
	}
}
