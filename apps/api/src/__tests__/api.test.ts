import { randomUUID } from "node:crypto";
import { app, db } from "@/api/app";
import type { CreateFilterParams } from "@/services/filters/types";
import type { Team, User, Workspace } from "@squared/db";
import {
	type FilterCondition,
	type SavedFilter,
	eq,
	githubRepoInfoTable,
	inArray,
	savedFiltersTable,
	tasksTable,
	teamsTable,
	userTeamsTable,
	userWorkspacesTable,
	usersTable,
	workspacesTable,
} from "@squared/db";
import request, { type Response } from "supertest";

describe("API Tests", () => {
	// so we can type the response.body property
	// https://github.com/ladjs/supertest/issues/720#issuecomment-1461919727
	type SuperResponse<T> = Omit<Response, "body"> & { body: T };

	// query the seeded database to retrieve a useable team/user combo
	async function getUserAndTeamIDs() {
		const teams = await db
			.select()
			.from(teamsTable)
			.leftJoin(userTeamsTable, eq(teamsTable.id, userTeamsTable.teamId));
		if (teams.length === 0) {
			throw new Error("no teams detected");
		}

		const team = teams[0];
		if (!team.UserTeam) {
			throw new Error("no users detected");
		}

		return { teamId: team.Team.id, userId: team.UserTeam.userId };
	}

	// Dates sent via rpc are serialized and so are not instances of the Date class, but
	// dates retrieved from drizzle are instances of the date class. So dates need
	// from the date class need to be serialized to an ISO string to allow deep object comparison.
	function serializeUserDates(user: User) {
		return {
			...user,
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
	function serializeWorkspaceDates(workspace: Workspace) {
		return {
			...workspace,
			createdAt: workspace.createdAt.toISOString(),
		};
	}

	function sortById<T extends { id: string }>(array: T[]) {
		return array.sort((a, b) => a.id.localeCompare(b.id));
	}

	it("should respond with 200 OK for the root path", async () => {
		const response = await request(app).get("/");
		expect(response.status).toBe(200);
		expect(response.text).toBe("ok");
	});

	describe("Filter Service Tests", () => {
		const createFilterEndpoint = "/rpc/filter/createFilter";
		const getFilterEndpoint = "/rpc/filter/getFilters";
		const updateFilterEndpoint = "/rpc/filter/updateFilter";
		const deleteFilterEndpoint = "/rpc/filter/deleteFilter";

		// ids of any filter inserted during tests
		let insertedIds: string[] = [];

		// reset insertedIds to empty array
		beforeEach(() => {
			insertedIds = [];
		});

		// clear any filters that have been created during the tests
		afterEach(async () => {
			await db
				.delete(savedFiltersTable)
				.where(inArray(savedFiltersTable.id, insertedIds));
		});

		// if a new filter is created successfully using an rpc endpoint,
		// its id needs to be added to the insertedIds array for cleanup.
		function addResponseId(response: request.Response) {
			const id = response.body.id;
			if (id) {
				insertedIds.push(id);
			}
		}

		function newBasicFilter(ids: {
			authorId: string;
			teamId: string;
		}): CreateFilterParams {
			return {
				authorId: ids.authorId,
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
			const { userId: authorId, teamId } = await getUserAndTeamIDs();
			const filter = newBasicFilter({ authorId, teamId });
			const response = await request(app)
				.post(createFilterEndpoint)
				.send(filter);
			addResponseId(response);

			expect(response.body).toMatchObject(filter);
		});

		it("does not insert a filter if the team doesn't exist", async () => {
			const { userId: authorId } = await getUserAndTeamIDs();
			const filter = newBasicFilter({ authorId, teamId: randomUUID() });
			const response = await request(app)
				.post(createFilterEndpoint)
				.send(filter);
			addResponseId(response);

			// this is a client error so the response code should be in the 400s
			expect(response.statusCode).toBeGreaterThanOrEqual(400);
			expect(response.statusCode).toBeLessThan(500);
		});

		it("does not insert a filter if the author doesn't exist", async () => {
			const { teamId } = await getUserAndTeamIDs();
			const filter = newBasicFilter({ authorId: randomUUID(), teamId });
			const response = await request(app)
				.post(createFilterEndpoint)
				.send(filter);
			addResponseId(response);

			expect(response.statusCode).toBeGreaterThanOrEqual(400);
			expect(response.statusCode).toBeLessThan(500);
		});

		it("retrieves multiple filters by team ID", async () => {
			const { teamId, userId: authorId } = await getUserAndTeamIDs();
			const sampleFilters: {
				authorId: string;
				teamId: string;
				type: "TEAM" | "WORKSPACE";
				name: string;
				description: string;
				sprintId: string | null;
				filter: FilterCondition[];
			}[] = [
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

			const insertedFilters = await db
				.insert(savedFiltersTable)
				.values(sampleFilters)
				.returning();
			for (const inserted of insertedFilters) {
				insertedIds.push(inserted.id);
			}

			const response: SuperResponse<SavedFilter[]> = await request(app)
				.post(getFilterEndpoint)
				.send({ teamId });

			// equate names first in case filters are returned from rpc service
			// in a different order than in the sampleFilters object
			for (const got of response.body) {
				const want = sampleFilters.find((f) => f.name === got.name);
				if (!want) {
					throw new Error("failed to match filters");
				}

				expect(got).toMatchObject(want);
			}
		});

		it("updates a valid filter", async () => {
			const { userId: authorId, teamId } = await getUserAndTeamIDs();
			const filter = newBasicFilter({ authorId, teamId });
			const [insertedFilter] = await db
				.insert(savedFiltersTable)
				.values({ ...filter, type: "TEAM" })
				.returning();
			insertedIds.push(insertedFilter.id);

			const updateFilterParams: Partial<CreateFilterParams> = {
				name: "updated test filter",
				description: "updated test filter description",
				filter: [
					{ field: "effortEstimate", value: 1, operator: "greaterThan" },
					{ field: "priority", value: "low", operator: "equals" },
				],
			};

			const response = await request(app).post(updateFilterEndpoint).send({
				filterId: insertedFilter.id,
				filters: updateFilterParams,
			});

			expect(response.body).toMatchObject(updateFilterParams);
		});

		it("deletes a valid filter", async () => {
			const { userId: authorId, teamId } = await getUserAndTeamIDs();
			const filter = newBasicFilter({ authorId, teamId });
			const [insertedFilter] = await db
				.insert(savedFiltersTable)
				.values({ ...filter, type: "TEAM" })
				.returning();
			insertedIds.push(insertedFilter.id);

			await request(app)
				.post(deleteFilterEndpoint)
				.send({ filterId: insertedFilter.id });

			const deletedFilter = await db
				.select()
				.from(savedFiltersTable)
				.where(eq(savedFiltersTable.id, insertedFilter.id));
			expect(deletedFilter.length).toBe(0);
		});
	});

	describe("User Service Tests", () => {
		const endpoints = {
			getDefaultWorkspace: "/rpc/user/getDefaultWorkspace",
			getUser: "/rpc/user/getUser",
			getUserAvatars: "/rpc/user/getUserAvatars",
			getTeamUsers: "/rpc/user/getTeamUsers",
			getUserTeams: "/rpc/user/getUserTeams",
			getUserRepositories: "/rpc/user/getUserRepositories",
			getWorkspaceUsers: "/rpc/user/getWorkspaceUsers",
			isUserAuthorized: "/rpc/user/isUserAuthorized",
			onBoardUser: "/rpc/user/onBoardUser",
			setLastViewedTask: "/rpc/user/setLastViewedTask",
			updateUser: "/rpc/user/updateUser",
			updateUserAvatar: "/rpc/user/updateUserAvatar",
			updateUserNotifications: "/rpc/user/updateUserNotifications",
		};

		it("onboards a valid user", async () => {
			const { userId } = await getUserAndTeamIDs();

			// make sure user is onboarding
			await db
				.update(usersTable)
				.set({ onBoarding: true })
				.where(eq(usersTable.externalId, userId));

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

			const updatedUser = await db
				.select()
				.from(usersTable)
				.where(eq(usersTable.externalId, userId))
				.then((user) => user[0])
				.then(serializeUserDates);

			expect(response.body).toMatchObject(updatedUser);
		});

		it("updates a valid user avatar url", async () => {
			const { userId } = await getUserAndTeamIDs();
			const newAvatarUrl =
				"https://api.dicebear.com/9.x/thumbs/svg?eyes=variant9W16";

			const response = await request(app)
				.post(endpoints.updateUserAvatar)
				.send({ userId, avatarUrl: newAvatarUrl });

			const updatedUser = await db
				.select()
				.from(usersTable)
				.where(eq(usersTable.externalId, userId))
				.then((user) => user[0]);

			expect(response.body.avatarUrl).toBe(updatedUser.avatarUrl);
		});

		it("updates a user's notification ids", async () => {
			const user = await db.query.usersTable.findFirst();
			if (!user) {
				throw new Error("no users detected in database");
			}

			// array of 10 random uuids to serve as the notifications
			const ids = Array.from(Array(10), (_) => randomUUID()).sort();
			await db
				.update(usersTable)
				.set({ savedNotificationIds: ids })
				.where(eq(usersTable.id, user.id));

			const response: SuperResponse<User> = await request(app)
				.post(endpoints.updateUserNotifications)
				.send({
					userId: user.externalId,
					notificationIds: ids,
				});

			const got = response.body.savedNotificationIds.sort();
			expect(got).toStrictEqual(ids);
		});

		it("gets a user by id", async () => {
			const { userId } = await getUserAndTeamIDs();
			const user = await db
				.select()
				.from(usersTable)
				.where(eq(usersTable.externalId, userId))
				.then((user) => user[0])
				.then(serializeUserDates);
			if (!user) {
				throw new Error("failed to find user");
			}

			const response = await request(app)
				.post(endpoints.getUser)
				.send({ userId });

			expect(response.body).toMatchObject(user);
		});

		it("gets all users in a team", async () => {
			const { teamId } = await getUserAndTeamIDs();
			const userIds = await db
				.select()
				.from(userTeamsTable)
				.leftJoin(usersTable, eq(userTeamsTable.userId, usersTable.externalId))
				.where(eq(userTeamsTable.teamId, teamId))
				.then((result) =>
					result
						.map((union) => union.User)
						.filter((u) => !!u)
						.map((u) => u.externalId),
				);
			if (userIds.length === 0) {
				throw new Error("failed to find users");
			}

			const want = await db
				.select()
				.from(usersTable)
				.where(inArray(usersTable.externalId, userIds))
				.then((result) => sortById(result))
				.then((result) => result.map(serializeUserDates));

			const response: SuperResponse<User[]> = await request(app)
				.post(endpoints.getTeamUsers)
				.send({ teamId });

			const got = sortById(response.body);
			expect(got).toStrictEqual(want);
		});

		it("gets all teams the user is a part of", async () => {
			const usersWithTeams = await db.query.usersTable
				.findMany({
					with: {
						userTeams: true,
					},
				})
				.then((res) => res.filter((u) => u.userTeams.length > 1));
			if (!usersWithTeams) {
				throw new Error(
					"failed to find user who is member of more than one team",
				);
			}

			const user = {
				externalId: usersWithTeams[0].externalId,
				teamIds: usersWithTeams[0].userTeams.map((ut) => ut.teamId),
			};

			const want = await db
				.select()
				.from(teamsTable)
				.where(inArray(teamsTable.id, user.teamIds))
				.then((result) => sortById(result))
				.then((result) => result.map(serializeTeamDates));

			const response: SuperResponse<Team[]> = await request(app)
				.post(endpoints.getUserTeams)
				.send({ userId: user.externalId });

			const got = sortById(response.body);
			expect(got).toStrictEqual(want);
		});

		it("gets all users in a workspace", async () => {
			const workspaces = await db
				.select({ id: workspacesTable.id })
				.from(workspacesTable);
			if (workspaces.length < 1) {
				throw new Error("no workspaces found in database");
			}
			const workspace = workspaces[0];

			const want = await db
				.select()
				.from(userWorkspacesTable)
				.where(eq(userWorkspacesTable.workspaceId, workspace.id))
				.leftJoin(
					usersTable,
					eq(usersTable.externalId, userWorkspacesTable.userId),
				)
				.then((result) => result.map((union) => union.User).filter((u) => !!u))
				.then((result) => result.map(serializeUserDates))
				.then(sortById);

			const response: SuperResponse<User[]> = await request(app)
				.post(endpoints.getWorkspaceUsers)
				.send({ workspaceId: workspace.id });

			const got = sortById(response.body);
			expect(got).toStrictEqual(want);
		});

		it("gets all user avatars in a workspace", async () => {
			const workspace = await db.query.workspacesTable
				.findMany({
					with: {
						userWorkspaces: true,
					},
				})
				.then((result) =>
					result.find((union) => union.userWorkspaces.length > 0),
				);
			if (!workspace) {
				throw new Error("failed to find workspace with users");
			}

			const userIds = workspace.userWorkspaces.map((uw) => uw.userId);
			const users = await db
				.select()
				.from(usersTable)
				.where(inArray(usersTable.externalId, userIds))
				.then((result) =>
					result.map((user) => ({
						id: user.externalId,
						name: user.name,
						avatarUrl: user.avatarUrl,
					})),
				);
			const want = sortById(users);

			const response: SuperResponse<
				{ id: string; name: string; avatarUrl: string }[]
			> = await request(app)
				.post(endpoints.getUserAvatars)
				.send({ workspaceId: workspace.id });

			const got = sortById(response.body);
			expect(got).toStrictEqual(want);
		});

		it("gets connected github repository information", async () => {
			const testUsername = "test_username";
			const user = await db
				.select()
				.from(usersTable)
				.limit(1)
				.then((result) => result[0]);

			await db
				.update(usersTable)
				.set({ githubUsername: testUsername })
				.where(eq(usersTable.id, user.id));

			const repoData = [
				{
					id: randomUUID(),
					owner: testUsername,
					repoName: "test_repo_one",
				},
				{
					id: randomUUID(),
					owner: testUsername,
					repoName: "test_repo_two",
				},
			];
			await db.insert(githubRepoInfoTable).values(repoData);

			const response: SuperResponse<string[]> = await request(app)
				.post(endpoints.getUserRepositories)
				.send({ userId: user.externalId });

			const want = repoData.map((repo) => repo.repoName).sort();
			const got = response.body.sort();
			expect(got).toStrictEqual(want);
		});

		it("does not get github repositories if the user has no specified github username", async () => {
			const user = await db
				.select()
				.from(usersTable)
				.limit(1)
				.then((result) => result[0]);

			await db
				.update(usersTable)
				.set({ githubUsername: null })
				.where(eq(usersTable.id, user.id));

			const response: SuperResponse<{ message: string }> = await request(app)
				.post(endpoints.getUserRepositories)
				.send({ userId: user.externalId });

			const re = /github username not found/gi;
			expect(response.body.message).toMatch(re);
		});

		it("gets a specified default workspace", async () => {
			const user = await db.query.usersTable
				.findMany({
					with: {
						userWorkspaces: true,
					},
				})
				.then((result) =>
					result.find((user) => user.userWorkspaces.length > 1),
				);
			if (!user) {
				throw new Error("failed to find user that is in multiple workspaces");
			}

			// default workspace, if not specified by user, is the first workspace found when ordering them by descending id
			// so to get an explicit test need to set the workspace to one different
			const notFallbackWorkspace = await db
				.select()
				.from(workspacesTable)
				.where(
					inArray(
						workspacesTable.id,
						user.userWorkspaces.map((uw) => uw.workspaceId),
					),
				)
				.then(
					(result) =>
						result.sort(
							(a, b) => b.createdAt.valueOf() - a.createdAt.valueOf(),
						)[1],
				)
				.then(serializeWorkspaceDates);

			await db
				.update(usersTable)
				.set({ defaultWorkspaceId: notFallbackWorkspace.id })
				.where(eq(usersTable.id, user.id));

			const response: SuperResponse<Workspace> = await request(app)
				.post(endpoints.getDefaultWorkspace)
				.send({ userId: user.externalId });
			expect(response.body).toStrictEqual(notFallbackWorkspace);
		});

		it("falls back to the first workspace if there is no specified default workspace", async () => {
			const user = await db.query.usersTable
				.findMany({
					with: {
						userWorkspaces: true,
					},
				})
				.then((result) =>
					result.find((user) => user.userWorkspaces.length > 1),
				);
			if (!user) {
				throw new Error("failed to find user that is in multiple workspaces");
			}

			const fallbackWorkspace = await db
				.select()
				.from(workspacesTable)
				.where(
					inArray(
						workspacesTable.id,
						user.userWorkspaces.map((uw) => uw.workspaceId),
					),
				)
				.then(
					(result) =>
						result.sort(
							(a, b) => b.createdAt.valueOf() - a.createdAt.valueOf(),
						)[0],
				)
				.then(serializeWorkspaceDates);

			await db
				.update(usersTable)
				.set({ defaultWorkspaceId: null })
				.where(eq(usersTable.id, user.id));

			const response: SuperResponse<Workspace> = await request(app)
				.post(endpoints.getDefaultWorkspace)
				.send({ userId: user.externalId });
			expect(response.body).toStrictEqual(fallbackWorkspace);
		});

		it("properly sets the last viewed task", async () => {
			const { userId, teamId } = await getUserAndTeamIDs();
			const user = await db
				.select()
				.from(usersTable)
				.where(eq(usersTable.externalId, userId))
				.then((result) => result[0]);

			const differentLastViewed = await db
				.select()
				.from(tasksTable)
				.where(eq(tasksTable.teamId, teamId))
				.then((result) =>
					result.find((task) => user.lastViewedTaskId !== task.id),
				);
			if (!differentLastViewed) {
				throw new Error(
					"failed to find task different from original last viewed",
				);
			}

			// update last viewed through rpc and reselect same user to verify
			await request(app)
				.post(endpoints.setLastViewedTask)
				.send({ userId, taskId: differentLastViewed.id });
			const updatedId = await db
				.select()
				.from(usersTable)
				.where(eq(usersTable.externalId, userId))
				.then((result) => result[0])
				.then((result) => result.lastViewedTaskId);

			expect(updatedId).toBe(differentLastViewed.id);
		});

		it("authorizes a user for a team they are a member of", async () => {
			const { userId, teamId } = await getUserAndTeamIDs();
			const team = await db
				.select()
				.from(teamsTable)
				.where(eq(teamsTable.id, teamId))
				.then((result) => result[0]);

			const response = await request(app)
				.post(endpoints.isUserAuthorized)
				.send({ userId, teamIdentifier: team.identifier });
			expect(response.body).toBe(true);
		});

		it("does not authorize a user for a team they are not a member of", async () => {
			const teams = await db.query.teamsTable.findMany();
			const user = await db.query.usersTable
				.findMany({
					with: { userTeams: true },
				})
				.then((result) =>
					result.find((user) => user.userTeams.length < teams.length),
				);
			if (!user) {
				throw new Error("failed to find user that is not part of all teams");
			}

			const invalidTeamIdentifier = teams.find(
				(team) => !user.userTeams.map((ut) => ut.teamId).includes(team.id),
			)?.identifier;
			if (!invalidTeamIdentifier) {
				throw new Error("failed to isolate invalid team");
			}

			const response: SuperResponse<boolean> = await request(app)
				.post(endpoints.isUserAuthorized)
				.send({
					userId: user.externalId,
					teamIdentifier: invalidTeamIdentifier,
				});

			expect(response.body).toBe(false);
		});
	});
});
