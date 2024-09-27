import request from "supertest";
import { app, server } from "..";

app.get("/hello", (_, res) => res.sendStatus(200));

describe("/hello", () => {
	it("/hello GET and expect status code 200", async () => {
		const res = await request(app).get("/hello");
		expect(res.statusCode).toBe(200);
	});
});

afterAll(() => {
	server.close();
});
