/**
 * https://jestjs.io/docs/getting-started
 * https://github.com/ladjs/supertest#readme
 * https://www.prisma.io/docs/orm/prisma-client/testing/integration-testing
 */

import request from "supertest";
import { prisma } from "@repo/seed";
import { seedTestDB, seedTasks } from "@repo/seed";
import "dotenv/config";

const host = `http://localhost:${process.env.PORT}`;

describe("sample test with prisma", () => {
	it("should create the specified user", async () => {
		const newUser = await prisma.user.create({
			data: {
				name: "test user",
				username: "squared_tester",
				email: "squared_tester@hotmail.com",
				verified: true,
				onBoarding: false,
			},
		});

		const user = await prisma.user.findUnique({
			where: {
				email: newUser.email,
			},
		});

		expect(user).toHaveProperty("name", "test user");
		expect(user).toHaveProperty("username", "squared_tester");
		expect(user).toHaveProperty("verified", true);
		expect(user).toHaveProperty("onBoarding", false);
	});
});

describe("sample api endpoint test", () => {
	it("should retrieve the seeded task", async () => {
		const seededTask = seedTasks[0];
		const _seededTaskValues = Object.values(seededTask);

		const res = await request(host).get(`/api/task/${seededTask.id}`);
		const fetchedTask = res.body.data;
		const _fetchedTaskValues = Object.values(fetchedTask);
	});
});

beforeAll(async () => {
	await seedTestDB()
		.then(() => {
			console.log("testing seed completed");
		})
		.catch((e) => {
			console.error("failed to seed", e);
		});
});

afterAll(async () => {
	await prisma.$disconnect();
});
