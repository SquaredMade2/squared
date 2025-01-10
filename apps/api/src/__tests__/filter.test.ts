import { randomUUID } from "node:crypto";
import { app, prisma } from "@/api/app";
import type { CreateFilterParams } from "@/services/filters/types";
import type { Prisma, SavedFilter } from "@squared/db";
import request from "supertest";

describe("Filter Service Tests", () => {
	const createFilterEndpoint = "/rpc/filter/createFilter";
	const getFilterEndpoint = "/rpc/filter/getFilters";
	const updateFilterEndpoint = "/rpc/filter/updateFilter";
	const deleteFilterEndpoint = "/rpc/filter/deleteFilter";

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
		const response = await request(app).post(createFilterEndpoint).send(filter);

		expect(response.body).toMatchObject(filter);
	});

	it("does not insert a filter if the team doesn't exist", async () => {
		const { authorId } = await getUserAndTeamIDs();
		const filter = newBasicFilter({ authorId, teamId: randomUUID() });
		const response = await request(app).post(createFilterEndpoint).send(filter);

		expect(response.statusCode).not.toBe(200);
	});

	it("does not insert a filter if the author doesn't exist", async () => {
		const { teamId } = await getUserAndTeamIDs();
		const filter = newBasicFilter({ authorId: randomUUID(), teamId });
		const response = await request(app).post(createFilterEndpoint).send(filter);

		expect(response.statusCode).not.toBe(200);
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

		await prisma.savedFilter.createMany({ data: sampleFilters });
		const response = await request(app)
			.post(getFilterEndpoint)
			.send({ teamId });
		const retrievedFilters: SavedFilter[] = response.body;

		// equate names first in case filters are returned from rpc service
		// in a different order than in the sampleFilters object
		for (const retrieved of retrievedFilters) {
			const original = sampleFilters.find(
				(f) => f.name === retrieved.name,
			);
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

		await request(app)
			.post(deleteFilterEndpoint)
			.send({ filterId: insertedFilter.id });

		expect(
			await prisma.savedFilter.findUnique({ where: { id: insertedFilter.id } }),
		).toBe(null);
	});
});
