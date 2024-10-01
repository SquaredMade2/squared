import request from "supertest";
import { app, server, prisma } from ".";
import { seedTestingDb, seededTestTaskId } from "@repo/test-db";

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
		const res = await request(app).get("/some/unimplemented/endpoint");
		expect(res.statusCode).toBe(404);
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
		const res = await request(app).get(`/api/task/${seededTestTaskId}`);
		expect(res.body.data.id).toBe(seededTestTaskId);
	});
});

/**
 * https://jestjs.io/docs/setup-teardown
 */
beforeAll(() => {
	return seedTestingDb(prisma);
});

afterAll(() => {
	// must explicitly stop the express server from listening or the test script will hang
	server.close();
});
