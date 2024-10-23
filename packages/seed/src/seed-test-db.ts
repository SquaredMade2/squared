import { prisma } from ".";
import { hashPassword } from "./hash-password";
import {
	users,
	workspaces,
	teams,
	tasks,
	usersPerWorkspace,
	usersPerTeam,
} from "./seed-test-data";
import "dotenv/config";

async function seedTestDB() {
	const usersWithPasswords = await Promise.all(
		users.map(async (u) => ({
			...u,
			password: await hashPassword(process.env.SEED_PASSWORD ?? ""),
		})),
	);

	await prisma.user.createMany({
		data: usersWithPasswords,
	});

	await prisma.workspace.createMany({
		data: workspaces,
	});

	const userWorkspaceRelations = workspaces.flatMap((wspace, idx) =>
		users
			.slice(idx * usersPerWorkspace, (idx + 1) * usersPerWorkspace)
			.map((u) => ({
				userId: u.id,
				workspaceId: wspace.id,
			})),
	);

	// create user-workspace relationships in bulk
	await prisma.userWorkspace.createMany({
		data: userWorkspaceRelations,
	});

	await prisma.team.createMany({
		data: teams.map((t) => ({
			id: t.id as string,
			workspaceId: t.workspaceId as string,
			name: t.name as string,
			identifier: t.identifier as string,
		})),
	});

	const userTeamRelations = teams.flatMap((t, idx) =>
		users.slice(idx * usersPerTeam, (idx + 1) * usersPerTeam).map((u) => ({
			userId: u.id,
			teamId: t.id,
		})),
	);

	// create user-team relationships in bulk
	await prisma.userTeam.createMany({
		data: userTeamRelations,
	});

	await prisma.task.createMany({
		data: tasks.map((t) => ({
			id: t.id as string,
			authorId: t.authorId as string,
			identifier: t.identifier as string,
			workspaceId: t.workspaceId as string,
			teamId: t.teamId as string,
			title: t.title as string,
		})),
	});
}

seedTestDB()
	.then(() => {
		console.log("Seeding for tests completed");
		return prisma.$disconnect();
	})
	.catch((e) => {
		console.error(e);
		return prisma.$disconnect();
	});
