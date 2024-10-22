import request from "supertest";
import testHost from "@/utils/testHost";
import { seedUsers } from "@repo/seed";

describe("/auth", () => {
	it("should not allow registering users that already exist", async () => {
		const res = await request(testHost)
			.post("/auth")
			.send({
				...seedUsers[0],
				password: "testing123",
				provider: "credentials",
				type: "register",
			})
			.set("Content-Type", "application/json")
			.set("Accept", "application/json");

		expect(res.body.message).toMatch(/already registered/g);
		expect(res.body.variant).toBe("destructive");
	});
});
