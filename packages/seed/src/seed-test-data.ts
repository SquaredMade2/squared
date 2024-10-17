import type { Prisma } from "@repo/db";
import type { prisma } from "./helpers";

type CreateUser = Prisma.Args<typeof prisma.user, "create">["data"];
type CreateWorkspace = Prisma.Args<typeof prisma.workspace, "create">["data"];
type CreateTeam = Prisma.Args<typeof prisma.team, "create">["data"];
type CreateTask = Prisma.Args<typeof prisma.task, "create">["data"];

const NUM_USERS = 8;
const NUM_WORKSPACES = 2;
const NUM_TEAMS = 4;
const NUM_TASKS = 8;

export const usersPerWorkspace = NUM_USERS / NUM_WORKSPACES;
export const usersPerTeam = NUM_USERS / NUM_TEAMS;

export const seedUsers: CreateUser[] = [
	{
		id: "141d7ad2-46e8-40f1-b66a-e3477000a1c7",
		name: "Joana Morissette",
		username: "Joana.Morissette",
		email: "Joana_Morissette44@hotmail.com",
	},
	{
		id: "176114be-7f4e-4c5b-8855-fd760eafe6ba",
		name: "Brielle Schneider",
		username: "Brielle.Schneider",
		email: "Brielle_Schneider0@gmail.com",
	},
	{
		id: "44fc21f8-897c-42b6-b61c-efc97b3a0fd3",
		name: "Carleton Botsford",
		username: "Carleton.Botsford",
		email: "Carleton.Botsford79@yahoo.com",
	},
	{
		id: "72599e9c-4e2f-4bab-9dea-f7f0f44dec9c",
		name: "Cheyenne Stoltenberg",
		username: "Cheyenne_Stoltenberg43",
		email: "Cheyenne_Stoltenberg@yahoo.com",
	},
	{
		id: "8989fc83-ab79-4bfb-b781-f6c3dfb0a481",
		name: "Lina Nicolas",
		username: "Lina_Nicolas38",
		email: "Lina.Nicolas8@hotmail.com",
	},
	{
		id: "01dc7ca8-b60a-4b7b-a590-6c19dc61aa9b",
		name: "Chaz Gleason",
		username: "Chaz.Gleason69",
		email: "Chaz.Gleason69@gmail.com",
	},
	{
		id: "17d9f047-045b-4f78-ad36-cd5017eddec7",
		name: "Pietro Nolan-Skiles",
		username: "Pietro_Nolan-Skiles",
		email: "Pietro.Nolan-Skiles37@gmail.com",
	},
	{
		id: "2df627ee-a0b6-441a-9e18-e0fca3f859b1",
		name: "Orin Marquardt",
		username: "Orin_Marquardt77",
		email: "Orin_Marquardt16@yahoo.com",
	},
];

export const seedWorkspaces: CreateWorkspace[] = [
	{
		id: "8016cb03-126b-485e-9a52-4ca02f609c3c",
		name: "rigid-excess",
		url: "rigid-excess",
	},
	{
		id: "d688f973-1590-41c9-89da-e5f4b662809c",
		name: "key-soup",
		url: "key-soup",
	},
];

export const seedTeams: CreateTeam[] = [
	{
		id: "cf508033-9791-4030-9a50-740e36900a01",
		workspaceId: "8016cb03-126b-485e-9a52-4ca02f609c3c",
		name: "hidden-lashes",
		identifier: "VNC",
	},
	{
		id: "71578f0d-3d29-45d4-9ffe-dcf1e6183d24",
		workspaceId: "8016cb03-126b-485e-9a52-4ca02f609c3c",
		name: "triangular-stranger",
		identifier: "CZO",
	},
	{
		id: "fd5ffed6-df03-41bf-9bbe-f4c520ae3e23",
		workspaceId: "d688f973-1590-41c9-89da-e5f4b662809c",
		name: "frequent-reach",
		identifier: "FLW",
	},
	{
		id: "6cc57a4e-515a-4948-9eca-def17e92164f",
		workspaceId: "d688f973-1590-41c9-89da-e5f4b662809c",
		name: "interesting-dead",
		identifier: "XTQ",
	},
];

export const seedTasks: CreateTask[] = [
	{
		id: "050224ca-adb4-4d06-83de-a6883d622d01",
		authorId: "141d7ad2-46e8-40f1-b66a-e3477000a1c7",
		identifier: "0001",
		workspaceId: "8016cb03-126b-485e-9a52-4ca02f609c3c",
		teamId: "cf508033-9791-4030-9a50-740e36900a01",
		title: "subvenio occaecati patria",
	},
	{
		id: "0d963a96-2019-490b-b2ac-52d807d76bc5",
		authorId: "176114be-7f4e-4c5b-8855-fd760eafe6ba",
		identifier: "0002",
		workspaceId: "8016cb03-126b-485e-9a52-4ca02f609c3c",
		teamId: "cf508033-9791-4030-9a50-740e36900a01",
		title: "nulla",
	},
	{
		id: "0f1b9a44-41ae-4adc-8778-c225d5d2a704",
		authorId: "44fc21f8-897c-42b6-b61c-efc97b3a0fd3",
		workspaceId: "8016cb03-126b-485e-9a52-4ca02f609c3c",
		teamId: "71578f0d-3d29-45d4-9ffe-dcf1e6183d24",
		identifier: "0003",
		title: "ecce hoc",
	},
	{
		id: "0f88cc74-ac6c-47df-a7ac-4195aa650f80",
		authorId: "72599e9c-4e2f-4bab-9dea-f7f0f44dec9c",
		identifier: "0004",
		workspaceId: "8016cb03-126b-485e-9a52-4ca02f609c3c",
		teamId: "71578f0d-3d29-45d4-9ffe-dcf1e6183d24",
		title: "mihi curre",
	},
	{
		id: "107743d0-5701-4348-a58a-67fe586e7572",
		authorId: "8989fc83-ab79-4bfb-b781-f6c3dfb0a481",
		identifier: "0005",
		workspaceId: "d688f973-1590-41c9-89da-e5f4b662809c",
		teamId: "fd5ffed6-df03-41bf-9bbe-f4c520ae3e23",
		title: "praecessit",
	},
	{
		id: "116ae525-3087-45fa-9cb3-2d774b0f1135",
		authorId: "01dc7ca8-b60a-4b7b-a590-6c19dc61aa9b",
		workspaceId: "d688f973-1590-41c9-89da-e5f4b662809c",
		identifier: "0006",
		teamId: "fd5ffed6-df03-41bf-9bbe-f4c520ae3e23",
		title: "sita est",
	},
	{
		id: "148187af-4c82-455e-afd7-ee33ec0509b1",
		authorId: "17d9f047-045b-4f78-ad36-cd5017eddec7",
		identifier: "0007",
		workspaceId: "d688f973-1590-41c9-89da-e5f4b662809c",
		teamId: "6cc57a4e-515a-4948-9eca-def17e92164f",
		title: "postero die",
	},
	{
		id: "151812e4-7188-407b-867d-26a26e5a1e4c",
		authorId: "2df627ee-a0b6-441a-9e18-e0fca3f859b1",
		identifier: "0008",
		workspaceId: "d688f973-1590-41c9-89da-e5f4b662809c",
		teamId: "6cc57a4e-515a-4948-9eca-def17e92164f",
		title: "propterea quod",
	},
];

if (seedUsers.length !== NUM_USERS)
	throw new Error("incorrect number of users");
if (seedWorkspaces.length !== NUM_WORKSPACES)
	throw new Error("incorrect number of workspaces");
if (seedTeams.length !== NUM_TEAMS)
	throw new Error("incorrect number of teams");
if (seedTasks.length !== NUM_TASKS)
	throw new Error("incorrect number of tasks");
