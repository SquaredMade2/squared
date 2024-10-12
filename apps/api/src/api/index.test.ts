import request from "supertest";
import { PrismaClient } from "@repo/db";
import { v4 as uuidv4 } from "uuid";

const seededTestTaskId = uuidv4();
const host = "http://localhost:5174";
const prisma = new PrismaClient();

/**
 * https://jestjs.io/docs/getting-started
 */
describe("sample test with jest", () => {
	const sum = (a: number, b: number) => a + b;

	it("should sum one and two to three", () => {
		expect(sum(1, 2)).toBe(3);
	});
});

/**
 * https://github.com/ladjs/supertest#readme
 */
describe("sample test with jest using supertest to make a request", () => {
	it("should return a 404 error when requesting an unimplemented endpoint", async () => {
		try {
			const res = await request(host).get("/some/unimplemented/endpoint");
			expect(res.statusCode).toBe(404);
		} catch (e) {
			console.dir(e, { depth: null });
			throw new Error("test failed");
		}
	});
});

/**
 * https://www.prisma.io/docs/orm/prisma-client/testing/integration-testing
 */
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
			const res = await request(host).get(`/api/task/${seededTestTaskId}`);
			expect(res.body.data.id).toBe(seededTestTaskId);
		} catch (e) {
			console.dir(e, { depth: null });
			throw new Error("test failed");
		}
	});
});

/**
 * https://jestjs.io/docs/setup-teardown
 */
beforeAll(async () => {
	async function seedTestingDb(prisma: PrismaClient) {
		const user = await prisma.user.create({
			data: {
				name: "testy mctestface",
				username: "tester123",
				email: "pro_tester@hotmail.com",
				verified: true,
				onBoarding: false,
			},
		});

		const workspaceName = "test-workspace";
		const workspaceCompanySize = 10;

		const workspace = await prisma.workspace.create({
			data: {
				name: workspaceName,
				companySize: workspaceCompanySize,
				url: workspaceName,
			},
		});

		const team = await prisma.team.create({
			data: {
				name: "testing-team",
				identifier: "ABC",
				workspaceId: workspace.id,
				Users: {
					create: {
						userId: user.id,
					},
				},
			},
		});

		const _task = await prisma.task.create({
			data: {
				id: seededTestTaskId,
				authorId: user.id,
				title: "test task",
				description: "test description",
				status: "inProgress",
				priority: "low",
				dueDate: new Date(),
				effortEstimate: 1,
				identifier: `${workspace.name}-01`,
				teamId: team.id,
				workspaceId: workspace.id,
			},
		});
	}

	try {
		await seedTestingDb(prisma);
		console.log("seeding successful");
	} catch (e) {
		console.dir(e);
	}
});

afterAll(async () => {
	await prisma.$disconnect();
});
