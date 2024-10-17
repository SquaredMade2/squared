import { prisma, hashPassword } from "./helpers";
import {
	seedUsers,
	seedWorkspaces,
	seedTeams,
	seedTasks,
	usersPerWorkspace,
	usersPerTeam,
} from "./seed-test-data";
import "dotenv/config";

async function seedDB() {
	const seedUsersWithPasswords = await Promise.all(
		seedUsers.map(async (u) => ({
			...u,
			password: await hashPassword(process.env.SEED_PASSWORD ?? ""),
		})),
	);

	await prisma.user.createMany({
		data: seedUsersWithPasswords,
	});

	await prisma.workspace.createMany({
		data: seedWorkspaces,
	});

	// add users to workspaces
	seedWorkspaces.map(async (wspace, idx) => {
		await prisma.workspace.update({
			where: {
				id: wspace.id,
			},
			data: {
				Users: {
					create: seedUsers
						.slice(idx * usersPerWorkspace, (idx + 1) * usersPerWorkspace)
						.map((u) => ({ userId: u.id as string })),
				},
			},
		});
	});

	await prisma.team.createMany({
		data: seedTeams.map((t) => ({
			id: t.id as string,
			workspaceId: t.workspaceId as string,
			name: t.name as string,
			identifier: t.identifier as string,
		})),
	});

	// add users to teams
	seedTeams.map(async (t, idx) => {
		await prisma.team.update({
			where: {
				id: t.id,
			},
			data: {
				Users: {
					create: seedUsers
						.slice(idx * usersPerTeam, (idx + 1) * usersPerTeam)
						.map((u) => ({ userId: u.id as string })),
				},
			},
		});
	});

	await prisma.task.createMany({
		data: seedTasks.map((t) => ({
			id: t.id as string,
			authorId: t.authorId as string,
			identifier: t.identifier as string,
			workspaceId: t.workspaceId as string,
			teamId: t.teamId as string,
			title: t.title as string,
		})),
	});
}

seedDB()
	.then(() => {
		console.log("Testing seed completed");
		return prisma.$disconnect();
	})
	.catch((e) => {
		console.error(e);
		return prisma.$disconnect();
	});
