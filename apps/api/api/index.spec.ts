import request from "supertest";
import { app, server } from ".";

describe("basic test with jest", () => {
	const sum = (a: number, b: number) => a + b;

	it("should sum to three", () => {
		expect(sum(1, 2)).toBe(3);
	});
});

describe("test with jest using supertest to make a request", () => {
	it("should return a 404 error when requesting an unimplemented endpoint", async () => {
		const res = await request(app).get("/some/unimplemented/endpoint");
		expect(res.statusCode).toBe(404);
	});
});

afterAll(() => {
	server.close();
});
