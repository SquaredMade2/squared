import { logger, hashPassword, prisma } from "./helpers";
import {
	users,
	workspaces,
	teams,
	tasks,
	usersPerWorkspace,
	usersPerTeam,
} from "./seed-test-data";
import "dotenv/config";

async function seed() {
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
		data: teams,
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
		data: tasks,
	});
}

export async function seedTestDB() {
	await seed()
		.then(() => {
			logger.info("Seeding for tests completed.");
		})
		.catch((e) => {
			logger.error("Error seeding database for testing: %0", e);
		});
}
