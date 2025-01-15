import { randomUUID } from "node:crypto";
import { app, prisma } from "@/api/app";
import type { CreateFilterParams } from "@/services/filters/types";
import type { Prisma, SavedFilter } from "@squared/db";
import request from "supertest";

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
			await prisma.savedFilter.deleteMany({
				where: { id: { in: insertedIds } },
			});
		});

		// if a new filter is created succesfully using an rpc endpoint,
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
			const teams = await prisma.team.findMany({
				include: {
					Users: true,
				},
			});
			if (teams.length === 0) {
				throw new Error("no teams detected");
			}

			const { Users: users, id: teamId } = teams[0];
			if (users.length === 0) {
				throw new Error("no users detected");
			}

			const sampleUser = users[0];
			return { teamId, authorId: sampleUser.userId };
		}

		it("inserts a valid filter", async () => {
			const filter = newBasicFilter(await getUserAndTeamIDs());
			const response = await request(app)
				.post(createFilterEndpoint)
				.send(filter);
			addResponseId(response);

			expect(response.body).toMatchObject(filter);
		});

		it("does not insert a filter if the team doesn't exist", async () => {
			const { authorId } = await getUserAndTeamIDs();
			const filter = newBasicFilter({ authorId, teamId: randomUUID() });
			const response = await request(app)
				.post(createFilterEndpoint)
				.send(filter);
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
				.send(filter);
			addResponseId(response);

			expect(response.statusCode).toBeGreaterThanOrEqual(400);
			expect(response.statusCode).toBeLessThan(500);
		});

		it("retrieves multiple filters by team ID", async () => {
			const { teamId, authorId } = await getUserAndTeamIDs();
			const sampleFilters: Prisma.SavedFilterCreateManyInput[] = [
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
				},
			];

			const insertedFilters = await prisma.savedFilter.createManyAndReturn({
				data: sampleFilters,
			});
			for (const inserted of insertedFilters) {
				insertedIds.push(inserted.id);
			}

			const response = await request(app)
				.post(getFilterEndpoint)
				.send({ teamId });
			const retrievedFilters: SavedFilter[] = response.body;

			// equate names first in case filters are returned from rpc service
			// in a different order than in the sampleFilters object
			for (const retrieved of retrievedFilters) {
				const original = sampleFilters.find((f) => f.name === retrieved.name);
				if (!original) {
					throw new Error("failed to match filters");
				}

				expect(retrieved).toMatchObject(original);
			}
		});

		it("updates a valid filter", async () => {
			const filter = newBasicFilter(await getUserAndTeamIDs());
			const insertedFilter = await prisma.savedFilter.create({
				data: { ...filter, type: "TEAM" },
			});
			insertedIds.push(insertedFilter.id);

			const updateFilterParams: Partial<CreateFilterParams> = {
				name: "updated test filter",
				description: "updated test filter description",
				filter: [
					{ field: "effortEstimate", value: 1, operator: "greaterThan" },
					{ field: "priority", value: "low", operator: "equals" },
				],
			};

			const response = await request(app).post(updateFilterEndpoint).send({
				filterId: insertedFilter.id,
				filters: updateFilterParams,
			});

			expect(response.body).toMatchObject(updateFilterParams);
		});

		it("deletes a valid filter", async () => {
			const filter = newBasicFilter(await getUserAndTeamIDs());
			const insertedFilter = await prisma.savedFilter.create({
				data: { ...filter, type: "TEAM" },
			});
			insertedIds.push(insertedFilter.id);

			await request(app)
				.post(deleteFilterEndpoint)
				.send({ filterId: insertedFilter.id });

			expect(
				await prisma.savedFilter.findUnique({
					where: { id: insertedFilter.id },
				}),
			).toBe(null);
		});
	});
});
