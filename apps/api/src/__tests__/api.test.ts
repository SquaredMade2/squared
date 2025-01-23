import { randomUUID } from "node:crypto";
import { app, prisma } from "@/api/app";
import type { CreateFilterParams } from "@/services/filters/types";
import type { Prisma, SavedFilter, Task, Team, User } from "@squared/db";
import request from "supertest";

describe("API Tests", () => {
	// query the seeded database to retrieve a useable team/user combo
	async function getUserAndTeamIDs() {
		const teams = await prisma.team.findMany({
			include: {
				Users: true,
			},
		});
		if (teams.length === 0) {
			throw new Error("no teams detected");
		}

		const { Users: users, id: teamId, identifier } = teams[0];
		if (users.length === 0) {
			throw new Error("no users detected");
		}

		const sampleUser = users[0];
		return { teamId, userId: sampleUser.userId, teamIdentifier: identifier };
	}

	function serializeUserDates(user: User) {
		return {
			...user,
			// The dates are sent as strings in the response object because a
			// date class instance is not serializable.
			// Using prisma, however, will instantiate a date instance so need to
			// serialize those fields to strings if you want equality comparison.
			createdAt: user.createdAt.toISOString(),
			lastLogin: user.lastLogin.toISOString(),
		};
	}

	function serializeTeamDates(team: Team) {
		return {
			...team,
			sprintStartDate: team.sprintStartDate.toISOString(),
		};
	}

	function serializeTaskDates(task: Task) {
		return {
			...task,
			dueDate: task.dueDate ? task.dueDate.toISOString() : null,
			dateCreated: task.dateCreated.toISOString(),
			updatedAt: task.updatedAt.toISOString(),
		};
	}

	it("should respond with 200 OK for the root path", async () => {
		const response = await request(app).get("/");
		expect(response.status).toBe(200);
		expect(response.text).toBe("ok");
	});

	describe("Filter Service Tests", () => {
		const endpoints = {
			createFilter: "/rpc/filter/createFilter",
			getFilter: "/rpc/filter/getFilters",
			updateFilter: "/rpc/filter/updateFilter",
			deleteFilter: "/rpc/filter/deleteFilter",
		};

		// ids of any filter inserted during tests
		let insertedIds: string[] = [];

		// reset insertedIds to empty array
		beforeEach(() => {
			insertedIds = [];
		});

		// clear any filters that have been created during the tests
		afterEach(async () => {
			await prisma.savedFilter.deleteMany({
				where: { id: { in: insertedIds } },
			});
		});

		// if a new filter is created succesfully using an rpc endpoint,
		// its id needs to be added to the insertedIds array for cleanup.
		function addResponseId(response: request.Response) {
			const id = response.body.id;
			if (id) {
				insertedIds.push(id);
			}
		}

		function newBasicFilter(ids: {
			userId: string;
			teamId: string;
		}): CreateFilterParams {
			return {
				authorId: ids.userId,
				teamId: ids.teamId,
				name: "test filter",
				description: "test description",
				sprintId: null,
				filter: [
					{ field: "effortEstimate", value: 5, operator: "lessThan" },
					{ field: "priority", value: "high", operator: "equals" },
				],
			};
		}

		it("inserts a valid filter", async () => {
			const filter = newBasicFilter(await getUserAndTeamIDs());
			const response = await request(app)
				.post(endpoints.createFilter)
				.send(filter);
			addResponseId(response);

			expect(response.body).toMatchObject(filter);
		});

		it("does not insert a filter if the team doesn't exist", async () => {
			const { userId: authorId } = await getUserAndTeamIDs();
			const filter = newBasicFilter({ userId: authorId, teamId: randomUUID() });
			const response = await request(app)
				.post(endpoints.createFilter)
				.send(filter);
			addResponseId(response);

			// this is a client error so the response code should be in the 400s
			expect(response.statusCode).toBeGreaterThanOrEqual(400);
			expect(response.statusCode).toBeLessThan(500);
		});

		it("does not insert a filter if the author doesn't exist", async () => {
			const { teamId } = await getUserAndTeamIDs();
			const filter = newBasicFilter({ userId: randomUUID(), teamId });
			const response = await request(app)
				.post(endpoints.createFilter)
				.send(filter);
			addResponseId(response);

			expect(response.statusCode).toBeGreaterThanOrEqual(400);
			expect(response.statusCode).toBeLessThan(500);
		});

		it("retrieves multiple filters by team ID", async () => {
			const { teamId, userId: authorId } = await getUserAndTeamIDs();
			const sampleFilters: Prisma.SavedFilterCreateManyInput[] = [
				{
					authorId,
					teamId,
					type: "TEAM",
					name: "test filter",
					description: "test description",
					sprintId: null,
					filter: [
						{ field: "effortEstimate", value: 5, operator: "lessThan" },
						{ field: "priority", value: "high", operator: "equals" },
					],
				},
				{
					authorId,
					teamId,
					type: "TEAM",
					name: "test filter two",
					description: "test description two",
					sprintId: null,
					filter: [
						{ field: "authorId", value: authorId, operator: "equals" },
						{
							field: "dateCreated",
							value: new Date().toISOString(),
							operator: "lessThan",
						},
					],
				},
			];

			const insertedFilters = await prisma.savedFilter.createManyAndReturn({
				data: sampleFilters,
			});
			for (const inserted of insertedFilters) {
				insertedIds.push(inserted.id);
			}

			const response = await request(app)
				.post(endpoints.getFilter)
				.send({ teamId });
			const retrievedFilters: SavedFilter[] = response.body;

			// equate names first in case filters are returned from rpc service
			// in a different order than in the sampleFilters object
			for (const retrieved of retrievedFilters) {
				const original = sampleFilters.find((f) => f.name === retrieved.name);
				if (!original) {
					throw new Error("failed to match filters");
				}

				expect(retrieved).toMatchObject(original);
			}
		});

		it("updates a valid filter", async () => {
			const filter = newBasicFilter(await getUserAndTeamIDs());
			const insertedFilter = await prisma.savedFilter.create({
				data: { ...filter, type: "TEAM" },
			});
			insertedIds.push(insertedFilter.id);

			const updateFilterParams: Partial<CreateFilterParams> = {
				name: "updated test filter",
				description: "updated test filter description",
				filter: [
					{ field: "effortEstimate", value: 1, operator: "greaterThan" },
					{ field: "priority", value: "low", operator: "equals" },
				],
			};

			const response = await request(app).post(endpoints.updateFilter).send({
				filterId: insertedFilter.id,
				filters: updateFilterParams,
			});

			expect(response.body).toMatchObject(updateFilterParams);
		});

		it("deletes a valid filter", async () => {
			const filter = newBasicFilter(await getUserAndTeamIDs());
			const insertedFilter = await prisma.savedFilter.create({
				data: { ...filter, type: "TEAM" },
			});
			insertedIds.push(insertedFilter.id);

			await request(app)
				.post(endpoints.deleteFilter)
				.send({ filterId: insertedFilter.id });

			expect(
				await prisma.savedFilter.findUnique({
					where: { id: insertedFilter.id },
				}),
			).toBe(null);
		});
	});

	describe("User Service Tests", () => {
		const endpoints = {
			getDefaultWorkspace: "/rpc/user/getDefaultWorkspace",
			getUser: "/rpc/user/getUser",
			getUserAvatars: "/rpc/user/getUserAvatars",
			getTeamUsers: "/rpc/user/getTeamUsers",
			getUserTeams: "/rpc/user/getUserTeams",
			getWorkspaceUsers: "/rpc/user/getWorkspaceUsers",
			isUserAuthorized: "/rpc/user/isUserAuthorized",
			onBoardUser: "/rpc/user/onBoardUser",
			setLastViewedTask: "/rpc/user/setLastViewedTask",
			updateUser: "/rpc/user/updateUser",
			updateUserAvatar: "/rpc/user/updateUserAvatar",
		};

		it("onboards a valid user", async () => {
			const { userId } = await getUserAndTeamIDs();

			// make sure user is onboarding
			await prisma.user.update({
				where: { externalId: userId },
				data: {
					onBoarding: true,
				},
			});

			const response = await request(app)
				.post(endpoints.onBoardUser)
				.send({ userId });

			expect(response.body).toMatchObject({
				externalId: userId,
				onBoarding: false,
			});
		});

		it("updates a valid user's name and username", async () => {
			const { userId } = await getUserAndTeamIDs();
			const updatedUserArgs = {
				name: "Updated User",
				username: "updated-user-123",
			};

			const response = await request(app)
				.post(endpoints.updateUser)
				.send({
					userId,
					...updatedUserArgs,
				});

			expect(response.body).toMatchObject({
				externalId: userId,
				...updatedUserArgs,
			});
		});

		it("updates a valid user avatar url", async () => {
			const { userId } = await getUserAndTeamIDs();
			const newAvatarUrl =
				"https://api.dicebear.com/9.x/thumbs/svg?eyes=variant9W16";

			const response = await request(app)
				.post(endpoints.updateUserAvatar)
				.send({ userId, avatarUrl: newAvatarUrl });

			expect(response.body.avatarUrl).toBe(newAvatarUrl);
		});

		it("gets a user by id", async () => {
			const { userId } = await getUserAndTeamIDs();
			const user = await prisma.user.findUnique({
				where: {
					externalId: userId,
				},
			});
			if (!user) {
				throw new Error("failed to find user");
			}

			const response = await request(app)
				.post(endpoints.getUser)
				.send({ userId });
			expect(response.body).toMatchObject(serializeUserDates(user));
		});

		it("gets all users in a team", async () => {
			const { teamId } = await getUserAndTeamIDs();
			const teamWithUsers = await prisma.team.findUnique({
				where: {
					id: teamId,
				},
				include: {
					Users: true,
				},
			});
			if (!teamWithUsers) {
				throw new Error("failed to locate team");
			}

			const userIds = teamWithUsers.Users.map((u) => u.userId);
			const response = await request(app)
				.post(endpoints.getTeamUsers)
				.send({ teamId });
			const responseUsers: User[] = response.body;

			expect(responseUsers.length).toBe(userIds.length);
			for (const user of responseUsers) {
				expect(userIds.includes(user.externalId)).toBe(true);
			}
		});

		it("gets all teams the user is a part of", async () => {
			const users = await prisma.user.findMany({
				include: {
					Teams: true,
				},
			});
			if (!users) {
				throw new Error("no users found in database");
			}

			const userWithManyTeams = users.find((u) => u.Teams.length > 1);
			if (!userWithManyTeams) {
				throw new Error("failed to find user that is part of multiple teams");
			}
			const teams = await prisma.team.findMany({
				where: {
					id: {
						in: userWithManyTeams.Teams.map((t) => t.teamId),
					},
				},
			});

			const response = await request(app)
				.post(endpoints.getUserTeams)
				.send({ userId: userWithManyTeams.externalId });

			if (!Array.isArray(response.body)) {
				throw new Error("invalid response receivec");
			}
			for (const got of response.body) {
				const want = teams.find((t) => t.id === got.id);
				if (!want) {
					throw new Error("failed to find team in response body");
				}
				expect(got).toMatchObject(serializeTeamDates(want));
			}
		});

		it("gets all users in a workspace", async () => {
			const workspace = await prisma.workspace.findMany({
				include: {
					Users: true,
				},
			});
			if (workspace.length === 0) {
				throw new Error("no workspaces found in database");
			}
			const workspaceWithUsers = workspace.find((w) => w.Users.length > 0);
			if (!workspaceWithUsers) {
				throw new Error("failed to find workspace with users");
			}

			const users = await prisma.user.findMany({
				where: {
					externalId: {
						in: workspaceWithUsers.Users.map((u) => u.userId),
					},
				},
			});

			const response = await request(app)
				.post(endpoints.getWorkspaceUsers)
				.send({ workspaceId: workspaceWithUsers.id });

			if (!Array.isArray(response.body)) {
				throw new Error("invalid response received");
			}
			for (const got of response.body) {
				const want = users.find((u) => u.externalId === got.externalId);
				if (!want) {
					throw new Error("failed to find user in response body");
				}
				expect(got).toMatchObject(serializeUserDates(want));
			}
		});

		it("gets all user avatars in a workspace", async () => {
			const workspace = await prisma.workspace.findMany({
				include: {
					Users: true,
				},
			});
			if (workspace.length === 0) {
				throw new Error("no workspaces found in database");
			}
			const workspaceWithUsers = workspace.find((w) => w.Users.length > 0);
			if (!workspaceWithUsers) {
				throw new Error("failed to find workspace with users");
			}

			const users = await prisma.user.findMany({
				where: {
					externalId: {
						in: workspaceWithUsers.Users.map((u) => u.userId),
					},
				},
			});

			const response = await request(app)
				.post(endpoints.getUserAvatars)
				.send({ workspaceId: workspaceWithUsers.id });

			if (!Array.isArray(response.body)) {
				throw new Error("invalid response received");
			}
			for (const got of response.body) {
				const want = users.find((u) => u.externalId === got.id);
				expect(want?.avatarUrl).toBe(got.avatarUrl);
			}
		});

		it("gets a specified default workspace", async () => {
			const users = await prisma.user.findMany({
				include: {
					Workspaces: true,
				},
			});
			if (!users) {
				throw new Error("no users in database");
			}

			// find a user who is in multiple workspaces
			const user = users.find((u) => u.Workspaces.length > 1);
			if (!user) {
				throw new Error("failed to find user who is in multiple workspaces");
			}

			const defaultId = user.Workspaces[user.Workspaces.length - 1].workspaceId;
			const shouldBeDefault = await prisma.workspace.findUnique({
				where: { id: defaultId },
			});
			if (!shouldBeDefault) {
				throw new Error("user is not part of any workspaces");
			}

			await prisma.user.update({
				where: {
					id: user.id,
				},
				data: {
					defaultWorkspaceId: defaultId,
				},
			});

			const response = await request(app)
				.post(endpoints.getDefaultWorkspace)
				.send({ userId: user.externalId });
			expect(response.body).toMatchObject(shouldBeDefault);
		});

		it("falls back to the first workspace if there is no specified default workspace", async () => {
			const users = await prisma.user.findMany({
				include: {
					Workspaces: true,
				},
			});
			if (!users) {
				throw new Error("no users in database");
			}

			// find a user who is in multiple workspaces
			const user = users.find((u) => u.Workspaces.length > 1);
			if (!user) {
				throw new Error("failed to find user who is in multiple workspaces");
			}

			const shouldBeDefault = await prisma.workspace.findUnique({
				where: {
					id: user.Workspaces[0].workspaceId,
				},
			});
			if (!shouldBeDefault) {
				throw new Error("failed to retrieve fallback default workspace");
			}

			// force remove default workspace if it exists
			await prisma.user.update({
				where: {
					id: user.id,
				},
				data: {
					defaultWorkspaceId: null,
				},
			});

			const response = await request(app)
				.post(endpoints.getDefaultWorkspace)
				.send({
					userId: user.externalId,
				});
			expect(response.body).toMatchObject(shouldBeDefault);
		});

		it("properly sets the last viewed task", async () => {
			const { userId, teamId } = await getUserAndTeamIDs();
			const user = await prisma.user.findUnique({
				where: {
					externalId: userId,
				},
			});
			if (!user) {
				throw new Error("failed to find user");
			}
			const tasks = await prisma.task.findMany({
				where: {
					teamId,
				},
			});

			const newLastViewed = tasks.find(
				(task) => task.id !== user.lastViewedTaskId,
			);
			if (!newLastViewed) {
				throw new Error("failed to find task different from last viewed");
			}

			const response = await request(app)
				.post(endpoints.setLastViewedTask)
				.send({ userId, taskId: newLastViewed.id });

			expect(response.body.lastViewedTask).toMatchObject(
				serializeTaskDates(newLastViewed),
			);
			expect(response.body.lastViewedTaskId).toBe(newLastViewed.id);
		});

		it("authorizes a user for a team they are a member of", async () => {
			const { userId, teamId } = await getUserAndTeamIDs();
			const team = await prisma.team.findUnique({
				where: {
					id: teamId,
				},
			});
			if (!team) {
				throw new Error("failed to find team");
			}

			const response = await request(app)
				.post(endpoints.isUserAuthorized)
				.send({ userId, teamIdentifier: team.identifier });
			expect(response.body).toBe(true);
		});

		it("does not authorize a user for a team they are not a member of", async () => {
			const teams = await prisma.team.findMany();
			if (teams.length === 0) {
				throw new Error("no teams in database");
			}

			const users = await prisma.user.findMany({
				include: {
					Teams: true,
				},
			});
			if (!users) {
				throw new Error("no users in database");
			}

			// find a user that isn't a part of every team
			const user = users.find((u) => u.Teams.length < teams.length);
			if (!user) {
				throw new Error("failed to find user that is not part of all teams");
			}

			// isolate the team the user isn't a part of
			const invalidTeam = teams.find(
				(team) =>
					!user.Teams.map((userTeam) => userTeam.teamId).includes(team.id),
			);
			if (!invalidTeam) {
				throw new Error("failed to isolate invalid team");
			}

			const response = await request(app)
				.post(endpoints.isUserAuthorized)
				.send({
					userId: user.externalId,
					teamIdentifier: invalidTeam.identifier,
				});
			expect(response.body).toBe(false);
		});
	});
});
