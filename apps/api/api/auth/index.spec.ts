import request from "supertest";
import { app, server } from "..";

describe("/api/auth", () => {
	it("/api/auth POST request without an email expect status code 500", async () => {
		const res = await request(app).post("/api/auth");
		expect(res.statusCode).toBe(500);
	});
});

afterAll(() => {
	server.close();
});
