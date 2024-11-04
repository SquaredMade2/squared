import request from "supertest";
import testHost from "@/utils/testHost";
import { tasks, prisma } from "@squared/seed";
import { v4 as uuidv4 } from "uuid";

describe("/task/[taskId]", () => {
	it("should GET a seeded task", async () => {
		const seededTask = tasks[0];
		const res = await request(testHost).get(`/task/${seededTask.id}`);
		expect(res.body.data).toMatchObject(seededTask);
	});

	it("should not GET a task that doesn't exist", async () => {
		const fakeTaskId = uuidv4();
		const res = await request(testHost).get(`/task/${fakeTaskId}`);
		expect(res.body.message).toMatch(/not found/g);
		expect(res.body.variant).toBe("destructive")
	});

	it("should DELETE a task", async () => {
		const seededTask = tasks[1];
		await request(testHost).delete(`/task/${seededTask.id}`);

		const deletedTask = await prisma.user.findUnique({
			where: {
				id: seededTask.id,
			},
		});
		expect(deletedTask).toBe(null);
	});
});
