import type { PrismaClient, SavedFilter } from "@squared/db";
import createCustomLogger from "@squared/logger";
import type { Logger } from "@squared/logger";
import type {
	CreateFilterParams,
	DeleteFilterParams,
	GetFilterParams,
	UpdateFilterParams,
} from "./types";
import type { FilterRpc } from "./types";

export class FilterService implements FilterRpc {
	private readonly db: PrismaClient;
	private readonly logger: Logger;
	constructor(db: PrismaClient) {
		this.db = db;
		this.logger = createCustomLogger("filters");
	}

	async createFilter(body: CreateFilterParams) {
		const { id, ...filterData } = body;
		this.logger.info("Creating filter: %0", { body });

		const existingFilter = await this.db.savedFilter.findUnique({
			where: { id },
		});
		if (existingFilter) {
			throw new Error("Filter already exists.");
		}

		const hasParent = this.filterHasValidParent(
			filterData.workspaceId,
			filterData.teamId,
		);
		if (!hasParent) {
			throw new Error(
				"Parent not found. Filters require specifying a parent workspace or team identifier.",
			);
		}

		const newFilter = await this.db.savedFilter.create({
			data: filterData,
		});
		if (!newFilter) {
			throw new Error("Failed to create new filter.");
		}

		return newFilter;
	}

	private async filterHasValidParent(
		workspaceId: string | null,
		teamId: string | null,
	): Promise<boolean> {
		if (!workspaceId && !teamId) {
			throw new Error(
				"Must provide a workspace or team id to serve as parent of filter.",
			);
		}
		if (workspaceId) {
			const workspace = await this.db.workspace.findUnique({
				where: { id: workspaceId },
			});
			return !!workspace;
		}
		if (teamId) {
			const team = await this.db.team.findUnique({ where: { id: teamId } });
			return !!team;
		}
		return false;
	}

	async updateFilter(body: UpdateFilterParams): Promise<SavedFilter> {
		this.logger.info("Updating filter: %0", { body });
		const filter = await this.db.savedFilter.update({
			where: { id: body.id },
			data: body,
		});

		if (!filter) {
			throw new Error("Failed to find filter.");
		}
		return filter;
	}

	async getFilter({
		workspaceId,
		teamId,
	}: GetFilterParams): Promise<SavedFilter[]> {
		if (workspaceId) {
			this.logger.info("Fetching filter for team ID: %s", teamId);
			return await this.db.savedFilter.findMany({
				where: { teamId },
			});
		}
		if (teamId) {
			this.logger.info("Fetching filter for workspace ID: %s", workspaceId);
			return await this.db.savedFilter.findMany({
				where: { workspaceId },
			});
		}
		throw new Error("Failed to specify a team or workspace ID.");
	}

	async deleteFilter({ id }: DeleteFilterParams): Promise<SavedFilter> {
		this.logger.info("Deleting filter by ID: %s", id);
		const filter = await this.db.savedFilter.delete({
			where: { id },
		});

		if (!filter) {
			throw new Error("Saved filter not found.");
		}
		return filter;
	}
}
