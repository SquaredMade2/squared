import type { PrismaClient } from ".";
import { randomUUID } from "node:crypto";

export const seededTestTaskId = randomUUID();

export async function seedTestingDb(prisma: PrismaClient) {
	const user = await prisma.user.create({
		data: {
			name: "testy mctestface",
			username: "tester123",
			email: "pro_tester@hotmail.com",
			verified: true,
			onBoarding: false,
		},
	});

	const workspaceName = "test-workspace";
	const workspaceCompanySize = 10;

	const workspace = await prisma.workspace.create({
		data: {
			name: workspaceName,
			companySize: workspaceCompanySize,
			url: workspaceName,
		},
	});

	const team = await prisma.team.create({
		data: {
			name: "testing-team",
			identifier: "ABC",
			workspaceId: workspace.id,
			Users: {
				create: {
					userId: user.id,
				},
			},
		},
	});

	const _task = await prisma.task.create({
		data: {
			id: seededTestTaskId,
			authorId: user.id,
			title: "test task",
			description: "test description",
			status: "inProgress",
			priority: "low",
			dueDate: new Date(),
			effortEstimate: 1,
			identifier: `${workspace.name}-01`,
			teamId: team.id,
			workspaceId: workspace.id,
		},
	});
}
