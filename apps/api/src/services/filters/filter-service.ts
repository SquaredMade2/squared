import {
	type DBClient,
	type SavedFilter as SavedFilterType,
	eq,
	savedFiltersTable,
} from "@squaredmade/db";
import type { Logger } from "@squaredmade/logger";
import createCustomLogger from "@squaredmade/logger";
import type {
	CreateFilterParams,
	FilterCondition,
	FilterRpc,
	SavedFilter,
} from "./types";

export class FilterService implements FilterRpc {
	private readonly db: DBClient;
	private readonly logger: Logger;

	constructor(db: DBClient) {
		this.db = db;
		this.logger = createCustomLogger("filters");
	}

	async createFilter(params: CreateFilterParams): Promise<SavedFilter> {
		this.logger.info("Creating filter with payload", params);
		return await this.db
			.insert(savedFiltersTable)
			.values({
				name: params.name,
				description: params.description,
				type: "TEAM",
				filter: params.filter,
				teamId: params.teamId,
				authorId: params.authorId,
				sprintId: params.sprintId,
			})
			.returning()
			.then((filter) => filter[0])
			.then(({ filter, ...rest }: SavedFilterType) => ({
				...rest,
				filter: filter as FilterCondition[],
			}));
	}

	async getFilters({ teamId }: { teamId: string }): Promise<SavedFilter[]> {
		this.logger.info("Getting filters for team with id", teamId);
		return this.db
			.select()
			.from(savedFiltersTable)
			.where(eq(savedFiltersTable.teamId, teamId))
			.then((f) =>
				f.map(({ filter, ...rest }: SavedFilterType) => ({
					...rest,
					filter: filter as FilterCondition[],
				})),
			);
	}

	async updateFilter({
		filterId,
		filters,
	}: {
		filterId: string;
		filters: {
			name?: string;
			description?: string | null;
			filter: FilterCondition[];
		};
	}): Promise<SavedFilter> {
		this.logger.info("Updating filter with id", filterId);

		const [updatedFilter] = await this.db
			.update(savedFiltersTable)
			.set({
				name: filters.name,
				description: filters.description,
				filter: filters.filter,
			})
			.where(eq(savedFiltersTable.id, filterId))
			.returning();

		if (!updatedFilter) {
			throw new Error(`Filter with id ${filterId} not found`);
		}

		return updatedFilter;
	}

	async deleteFilter({ filterId }: { filterId: string }): Promise<void> {
		this.logger.info("Deleting filter with id", filterId);

		const result = await this.db
			.delete(savedFiltersTable)
			.where(eq(savedFiltersTable.id, filterId));

		if (result.rowCount === 0) {
			throw new Error(`Filter with id ${filterId} not found`);
		}
	}
}
