import type { PrismaClient, SavedFilter as SavedFilterType } from "@squared/db";
import type { Logger } from "@squared/logger";
import createCustomLogger from "@squared/logger";
import type {
	CreateFilterParams,
	FilterCondition,
	FilterRpc,
	SavedFilter,
} from "./types";

export class FilterService implements FilterRpc {
	private readonly db: PrismaClient;
	private readonly logger: Logger;

	constructor(prisma: PrismaClient) {
		this.db = prisma;
		this.logger = createCustomLogger("filters");
	}

	async createFilter(params: CreateFilterParams): Promise<void> {
		this.logger.info("Creating filter with payload: %0", params);
		await this.db.savedFilter.create({
			data: {
				name: params.name,
				description: params.description,
				type: "TEAM",
				filter: params.filter,
				teamId: params.teamId,
				authorId: params.authorId,
			},
		});
	}

	async getFilters({ teamId }: { teamId: string }): Promise<SavedFilter[]> {
		this.logger.info("Getting filters for team with id: %s", teamId);
		return this.db.savedFilter
			.findMany({
				where: { teamId },
			})
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
		this.logger.info("Updating filter with id: %s", filterId);
		return await this.db.savedFilter
			.update({
				where: { id: filterId },
				data: filters,
			})
			.then(({ filter, ...rest }: SavedFilterType) => ({
				...rest,
				filter: filter as FilterCondition[],
			}));
	}

	async deleteFilter({ filterId }: { filterId: string }): Promise<void> {
		this.logger.info("Deleting filter with id: %s", filterId);
		await this.db.savedFilter.delete({ where: { id: filterId } });
	}
}
