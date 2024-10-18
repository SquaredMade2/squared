import request from "supertest";
import { PrismaClient } from "@repo/db";
import { seedTestDB, seedTasks } from "@repo/seed";
import "dotenv/config";

const host = `http://localhost:5173${process.env.PORT}`;
const prisma = new PrismaClient();

// https://jestjs.io/docs/getting-started
// https://github.com/ladjs/supertest#readme
// https://www.prisma.io/docs/orm/prisma-client/testing/integration-testing
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
		try {
			console.log(seedTasks[0]);
			const res = await request(host).get(`/api/task/${seedTasks[0].id}`);
			expect(res.body.data.id).toBe(seedTasks[0].id);
		} catch (e) {
			console.dir(e, { depth: null });
			throw new Error("test failed");
		}
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
