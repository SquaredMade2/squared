import { randomUUID } from "node:crypto";
import { app, prisma } from "@/api/app";
import type { CreateFilterParams } from "@/services/filters/types";
import { type SavedFilter, SavedFilterType } from "@squared/db";
import request from "supertest";

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

// uses the seeded database to retrieve a team/user combo
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

describe("Filter Service Tests", () => {
	const createFilterEndpoint = "/rpc/filter/createFilter";
	const getFilterEndpoint = "/rpc/filter/getFilters";

	it("inserts a valid filter", async () => {
		const { teamId, authorId } = await getUserAndTeamIDs();
		const filter = newBasicFilter({ authorId, teamId });

		const response = await request(app)
			.post(createFilterEndpoint)
			.send(filter)
			.set("Content-Type", "application/json")
			.set("Accept", "application/json");

		expect(response.body).toMatchObject(filter);
	});

	it("does not insert a filter if the team doesn't exist", async () => {
		const { authorId } = await getUserAndTeamIDs();
		const filter = newBasicFilter({ authorId, teamId: randomUUID() });

		const response = await request(app)
			.post(createFilterEndpoint)
			.send(filter)
			.set("Content-Type", "application/json")
			.set("Accept", "application/json");

		expect(response.statusCode).not.toBe(200);
	});

	it("does not insert a filter if the author doesn't exist", async () => {
		const { teamId } = await getUserAndTeamIDs();
		const filter = newBasicFilter({ authorId: randomUUID(), teamId });

		const response = await request(app)
			.post(createFilterEndpoint)
			.send(filter)
			.set("Content-Type", "application/json")
			.set("Accept", "application/json");

		expect(response.statusCode).not.toBe(200);
	});

	it("does not insert a filter that has no conditions", async () => {
		const { teamId, authorId } = await getUserAndTeamIDs();
		const noConditionFilter = {
			authorId,
			teamId,
			name: "test filter",
			description: "test description",
			sprintId: null,
			filter: [],
		};

		const response = await request(app)
			.post(createFilterEndpoint)
			.send(noConditionFilter)
			.set("Content-Type", "application/json")
			.set("Accept", "application/json");

		expect(response.statusCode).not.toBe(200);
	});

	it("retrieves multiple filters by team ID", async () => {
		const { teamId, authorId } = await getUserAndTeamIDs();
		const sampleFilters = [
			{
				authorId,
				teamId,
				type: SavedFilterType.TEAM,
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
				type: SavedFilterType.TEAM,
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
			.send({ teamId })
			.set("Content-Type", "application/json")
			.set("Accept", "application/json");

		const retrievedFilters: SavedFilter[] = response.body;
		for (const retrieved of retrievedFilters) {
			const correspondingBase = sampleFilters.find(
				(f) => f.name === retrieved.name,
			);
			if (!correspondingBase) {
				throw new Error("failed to match filters");
			}

			expect(retrieved).toMatchObject(correspondingBase);
		}
	});

	it("updates a filter correctly", async () => {});
	it("deletes a filter correctly", async () => {});
});
