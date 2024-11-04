import { testHost } from "@/utils/testUtils";
import { prisma } from "@squared/seed";
import request from "supertest";

const dummyCredentialsUser = {
	name: "John Doe",
	username: "john-doe",
	email: "john_doe@gmail.net",
};

async function createCredentialsUser() {
	await prisma.user.create({
		data: dummyCredentialsUser,
	});
}

async function deleteCredentialsUser() {
	await prisma.user.delete({
		where: {
			email: dummyCredentialsUser.email,
		},
	});
}

describe("/auth", () => {
	describe("credentials", () => {
		beforeEach(createCredentialsUser);
		afterEach(deleteCredentialsUser);

		it("should not allow registering users that already exist", async () => {
			const res = await request(testHost)
				.post("/auth")
				.send({
					...dummyCredentialsUser,
					password: "testing123",
					provider: "credentials",
					type: "register",
				})
				.set("Content-Type", "application/json")
				.set("Accept", "application/json");

			expect(res.body.message).toMatch(/already registered/gi);
			expect(res.body.variant).toBe("destructive");
		});

		it("should not allow registering without a password", async () => {
			const res = await request(testHost)
				.post("/auth")
				.send({
					...dummyCredentialsUser,
					provider: "credentials",
					type: "register",
				})
				.set("Content-Type", "application/json")
				.set("Accept", "application/json");

			expect(res.body.message).toMatch(/email and password are required/gi);
			expect(res.body.variant).toBe("destructive");
		});
	});
});
