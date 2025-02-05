import { randomUUID } from "node:crypto";
import { app, db } from "@/api/app";
import {
	type SuperResponse,
	getUserAndTeamIDs,
	serializeTeamDates,
	serializeUserDates,
	serializeWorkspaceDates,
	sortById,
} from "@/utils/testHelpers";
import type { Team, User, Workspace } from "@squared/db";
import {
	desc,
	eq,
	githubRepoInfoTable,
	inArray,
	tasksTable,
	teamsTable,
	userTeamsTable,
	userWorkspacesTable,
	usersTable,
	workspacesTable,
} from "@squared/db";
import request from "supertest";

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

	it("onboards user", async () => {
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

	it("updates a user's name and username", async () => {
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

	it("updates a user's avatar url", async () => {
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
			.orderBy(usersTable.id)
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
			.orderBy(teamsTable.id)
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
			.orderBy(usersTable.id)
			.then((result) => result.map((union) => union.User).filter((u) => !!u))
			.then((result) => result.map(serializeUserDates));

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
			.orderBy(usersTable.externalId)
			.then((result) =>
				result.map((user) => ({
					id: user.externalId,
					name: user.name,
					avatarUrl: user.avatarUrl,
				})),
			);

		const response: SuperResponse<
			{ id: string; name: string; avatarUrl: string }[]
		> = await request(app)
			.post(endpoints.getUserAvatars)
			.send({ workspaceId: workspace.id });

		const got = sortById(response.body);
		expect(got).toStrictEqual(users);
	});

	it("gets a user's connected github repository information", async () => {
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
		expect(response.statusCode).toBeGreaterThanOrEqual(400);
		expect(response.statusCode).toBeLessThan(500);
		expect(response.body.message).toMatch(re);
	});

	it("gets a specified default workspace", async () => {
		const user = await db.query.usersTable
			.findMany({
				with: {
					userWorkspaces: true,
				},
			})
			.then((result) => result.find((user) => user.userWorkspaces.length > 1));
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
			.then((result) => result.find((user) => user.userWorkspaces.length > 1));
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
			.orderBy(desc(workspacesTable.createdAt))
			.then((result) => result[0])
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

		const response: SuperResponse<boolean> = await request(app)
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
