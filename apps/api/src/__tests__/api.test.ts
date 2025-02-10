import { randomUUID } from "node:crypto";
import { app, db } from "@/api/app";
import type { CreateFilterParams } from "@/services/filters/types";
import {
	type SavedFilter,
	eq,
	inArray,
	savedFiltersTable,
	teamsTable,
	userTeamsTable,
} from "@squared/db";
import superjson from "@squared/superjson";
import request from "supertest";

const superJsonMiddleware = (body: any) => {
	return JSON.parse(superjson.stringify(body));
};

describe("API Tests", () => {
	it("should respond with 200 OK for the root path", async () => {
		const response = await request(app).get("/");
		expect(response.status).toBe(200);
		expect(response.text).toBe("ok");
	});

	describe("Filter Service Tests", () => {
		const createFilterEndpoint = "/rpc/filter/createFilter";
		const getFilterEndpoint = "/rpc/filter/getFilters";
		const updateFilterEndpoint = "/rpc/filter/updateFilter";
		const deleteFilterEndpoint = "/rpc/filter/deleteFilter";

		// ids of any filter inserted during tests
		let insertedIds: string[] = [];

		// reset insertedIds to empty array
		beforeEach(() => {
			insertedIds = [];
		});

		// clear any filters that have been created during the tests
		afterEach(async () => {
			await db
				.delete(savedFiltersTable)
				.where(inArray(savedFiltersTable.id, insertedIds));
		});

		// if a new filter is created successfully using an rpc endpoint,
		// its id needs to be added to the insertedIds array for cleanup.
		function addResponseId(response: request.Response) {
			const id = response.body.id;
			if (id) {
				insertedIds.push(id);
			}
		}

		function newBasicFilter(ids: {
			authorId: string;
			teamId: string;
		}): CreateFilterParams {
			return {
				authorId: ids.authorId,
				teamId: ids.teamId,
				name: "test filter",
				description: "test description",
				sprintId: null,
				filter: [
					{ field: "effortEstimate", value: 5, operator: "lessThan" },
					{ field: "priority", value: "high", operator: "equals" },
				],
			};
		}

		// query the seeded database to retrieve a useable team/user combo
		async function getUserAndTeamIDs() {
			const teams = await db
				.select()
				.from(teamsTable)
				.leftJoin(userTeamsTable, eq(teamsTable.id, userTeamsTable.teamId));
			if (teams.length === 0) {
				throw new Error("no teams detected");
			}

			const team = teams[0];
			if (!team.UserTeam) {
				throw new Error("no users detected");
			}

			return { teamId: team.Team.id, authorId: team.UserTeam.userId };
		}

		it("inserts a valid filter", async () => {
			const filter = newBasicFilter(await getUserAndTeamIDs());
			const response = await request(app)
				.post(createFilterEndpoint)
				.send(superJsonMiddleware(filter));
			addResponseId(response);

			expect(response.body).toMatchObject(filter);
		});

		it("does not insert a filter if the team doesn't exist", async () => {
			const { authorId } = await getUserAndTeamIDs();
			const filter = newBasicFilter({ authorId, teamId: randomUUID() });
			const response = await request(app)
				.post(createFilterEndpoint)
				.send(superJsonMiddleware(filter));
			addResponseId(response);

			// this is a client error so the response code should be in the 400s
			expect(response.statusCode).toBeGreaterThanOrEqual(400);
			expect(response.statusCode).toBeLessThan(500);
		});

		it("does not insert a filter if the author doesn't exist", async () => {
			const { teamId } = await getUserAndTeamIDs();
			const filter = newBasicFilter({ authorId: randomUUID(), teamId });
			const response = await request(app)
				.post(createFilterEndpoint)
				.send(superJsonMiddleware(filter));
			addResponseId(response);

			expect(response.statusCode).toBeGreaterThanOrEqual(400);
			expect(response.statusCode).toBeLessThan(500);
		});

		it("retrieves multiple filters by team ID", async () => {
			const { teamId, authorId } = await getUserAndTeamIDs();
			const sampleFilters: SavedFilter[] = [
				{
					authorId,
					teamId,
					type: "TEAM",
					name: "test filter",
					description: "test description",
					sprintId: null,
					filter: [
						{ field: "effortEstimate", value: 5, operator: "lessThan" },
						{ field: "priority", value: "high", operator: "equals" },
					],
					id: "69807de5-5c97-4cd4-b4b3-b62b21cffd3a",
					workspaceId: null,
				},
				{
					authorId,
					teamId,
					type: "TEAM",
					name: "test filter two",
					description: "test description two",
					sprintId: null,
					filter: [
						{ field: "authorId", value: authorId, operator: "equals" },
						{
							field: "dateCreated",
							value: new Date().toISOString(),
							operator: "lessThan",
						},
					],
					id: "764871ba-cd9f-4c61-8941-0797609125fb",
					workspaceId: null,
				},
			];

			const insertedFilters = await db
				.insert(savedFiltersTable)
				.values(sampleFilters)
				.returning();
			for (const inserted of insertedFilters) {
				insertedIds.push(inserted.id);
			}

			const response = await request(app)
				.post(getFilterEndpoint)
				.send(superJsonMiddleware({ teamId }));
			const retrievedFilters: SavedFilter[] = response.body;

			// equate names first in case filters are returned from rpc service
			// in a different order than in the sampleFilters object
			for (const sample of sampleFilters) {
				const original = retrievedFilters.find((f) => f.name === sample.name);
				if (!original) {
					throw new Error("failed to match filters");
				}

				expect(sample).toMatchObject(original);
			}
		});

		it("updates a valid filter", async () => {
			const filter = newBasicFilter(await getUserAndTeamIDs());
			const [insertedFilter] = await db
				.insert(savedFiltersTable)
				.values({ ...filter, type: "TEAM" })
				.returning();
			insertedIds.push(insertedFilter.id);

			const updateFilterParams: Partial<CreateFilterParams> = {
				name: "updated test filter",
				description: "updated test filter description",
				filter: [
					{ field: "effortEstimate", value: 1, operator: "greaterThan" },
					{ field: "priority", value: "low", operator: "equals" },
				],
			};

			const response = await request(app)
				.post(updateFilterEndpoint)
				.send(
					superJsonMiddleware({
						filterId: insertedFilter.id,
						filters: updateFilterParams,
					}),
				);

			expect(response.body).toMatchObject(updateFilterParams);
		});

		it("deletes a valid filter", async () => {
			const filter = newBasicFilter(await getUserAndTeamIDs());
			const [insertedFilter] = await db
				.insert(savedFiltersTable)
				.values({ ...filter, type: "TEAM" })
				.returning();
			insertedIds.push(insertedFilter.id);

			await request(app)
				.post(deleteFilterEndpoint)
				.send(superJsonMiddleware({ filterId: insertedFilter.id }));

			const deletedFilter = await db
				.select()
				.from(savedFiltersTable)
				.where(eq(savedFiltersTable.id, insertedFilter.id));
			expect(deletedFilter.length).toBe(0);
		});
	});
});
