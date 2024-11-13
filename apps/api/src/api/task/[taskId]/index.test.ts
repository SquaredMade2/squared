import { prisma, resetDB, seedTestDB, tasks } from "@squared/seed";
import request from "supertest";
import { v4 as uuidv4 } from "uuid";
import { app } from "../..";

describe("/task/[taskId]", () => {
	const seededTask = {
		id: "050224ca-adb4-4d06-83de-a6883d622d01",
		authorId: "141d7ad2-46e8-40f1-b66a-e3477000a1c7",
		identifier: "VNC-0001",
		workspaceId: "8016cb03-126b-485e-9a52-4ca02f609c3c",
		teamId: "cf508033-9791-4030-9a50-740e36900a01",
		title: "subvenio occaecati patria",
	};

	beforeAll(seedTestDB);
	afterAll(resetDB);

	it("should GET a seeded task", async () => {
		const res = await request(app).get(`/api/task/${seededTask.id}`);
		expect(res.body.data).toMatchObject(seededTask);
	});

	it("should not GET a task that doesn't exist", async () => {
		const fakeTaskId = uuidv4();
		const res = await request(app).get(`/api/task/${fakeTaskId}`);
		expect(res.body.message).toMatch(/not found/gi);
		expect(res.body.variant).toBe("destructive");
	});

	it("should DELETE a task", async () => {
		const seededTask = tasks[1];
		await request(app).delete(`/api/task/${seededTask.id}`);

		const deletedTask = await prisma.user.findUnique({
			where: {
				id: seededTask.id,
			},
		});
		expect(deletedTask).toBe(null);
	});
});
