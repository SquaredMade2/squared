// This script seeds the database with:
// -> 2 workspaces
// --> 2 teams per workspace
// ---> 4 tasks per team

import { faker } from "@faker-js/faker";
import {
	addWorkspace,
	addTeam,
	addTask,
	addUser,
	addUserToWorkspace,
	prisma,
} from "./helpers";
import type { Workspace } from "@repo/db";

const NUM_WORKSPACES = 2;
const NUM_TEAMS = 2;
const NUM_TASKS = 4;

const promiseArray = <T>(n: number, fn: () => Promise<T>) =>
	Array.from(Array(n), fn);

async function seedDB() {
	const workspaces = await Promise.all(
		promiseArray<Workspace>(NUM_WORKSPACES, addWorkspace),
	);
}

seedDB()
	.then(() => {
		console.log("Seed completed");
		return prisma.$disconnect();
	})
	.catch((e) => {
		console.error(e);
		return prisma.$disconnect();
	});
