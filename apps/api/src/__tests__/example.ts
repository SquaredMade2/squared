import request from "supertest";
import { createApp } from "../api/app";

describe("API Tests", () => {
	const app = createApp();

	it("should respond with 200 OK for the root path", async () => {
		const response = await request(app).get("/");
		expect(response.status).toBe(200);
		expect(response.text).toBe("ok");
	});

	// Add more tests here
	it("should handle CORS for allowed origins", async () => {
		const response = await request(app)
			.get("/")
			.set("Origin", "https://app.squaredmade.com");
		expect(response.headers["access-control-allow-origin"]).toBe(
			"https://app.squaredmade.com",
		);
	});

	it("should reject CORS for disallowed origins", async () => {
		const response = await request(app)
			.get("/")
			.set("Origin", "https://malicious-site.com");
		expect(response.headers["access-control-allow-origin"]).toBeUndefined();
	});

	// Test RPC endpoint (you'll need to adjust this based on your actual RPC setup)
	it("should handle RPC requests", async () => {
		const response = await request(app)
			.post("/rpc")
			.send({ method: "someMethod", params: {} });
		expect(response.status).toBe(200);
		// Add more specific assertions based on your RPC implementation
	});
});
