import request from "supertest";
import { app } from "../api/app";

describe("API Tests", () => {
	it("should respond with 200 OK for the root path", async () => {
		const response = await request(app).get("/");
		expect(response.status).toBe(200);
		expect(response.text).toBe("ok");
	});

	// Add more tests here
});
