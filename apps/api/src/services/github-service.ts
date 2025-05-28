import { baseProcedure, j } from "@/utils/sqStack";
import {
	and,
	eq,
	githubCommitsTable,
	githubOrgTable,
	githubPullRequestTaskTable,
	githubPullRequestsTable,
	githubRepoTable,
	inArray,
	tasksTable,
	workspacesTable,
} from "@squaredmade/db";
import { HTTPException } from "hono/http-exception";
import z from "zod/v4";
import { githubOrgSchema, githubRepoSchema } from "./schema";

export const githubService = j.router({
	getWorkspaceOrganizations: baseProcedure
		.input(z.object({ workspaceId: z.string() }))
		.query(async ({ input, ctx, c }) => {
			const { db, logger } = ctx;
			logger.info(
				"Fetching workspace organizations with id: ",
				input.workspaceId,
			);
			const orgs = await db
				.select({
					name: githubOrgTable.name,
					createdAt: githubOrgTable.createdAt,
				})
				.from(githubOrgTable)
				.where(eq(githubOrgTable.workspaceId, input.workspaceId));
			return c.superjson(orgs);
		}),
	upsertPullRequest: baseProcedure
		.input(
			z.object({
				id: z.string(),
				number: z.number(),
				state: z.enum(["open", "closed"]),
				title: z.string(),
				url: z.string(),
				branch: z.string(),
				body: z.string(),
				author: z.string(),
				timestamp: z.string(),
				repo: githubRepoSchema.omit({ externalId: true }),
				org: githubOrgSchema.omit({
					externalId: true,
					workspaceId: true,
					createdAt: true,
				}),
			}),
		)
		.mutation(async ({ input, ctx, c }) => {
			const { db, logger } = ctx;
			const {
				id,
				number,
				state,
				title,
				url,
				branch,
				body,
				author,
				timestamp,
				repo,
				org,
			} = input;
			logger.info("Upserting pull request with id: ", input.id);
			const taskIdMatches = [
				...title.matchAll(/\[(.*?)\]/g),
				...(body?.matchAll(/\[(.*?)\]/g) ?? []),
			].map((match) => match[1]);

			const tasks = await db.transaction(async (tx) => {
				const tasks = await tx
					.select({
						id: tasksTable.id,
						identifier: tasksTable.identifier,
						workspaceUrl: workspacesTable.url,
						title: tasksTable.title,
						workspaceId: tasksTable.workspaceId,
					})
					.from(tasksTable)
					.leftJoin(
						workspacesTable,
						eq(tasksTable.workspaceId, workspacesTable.externalId),
					)
					.where(inArray(tasksTable.identifier, taskIdMatches));

				if (tasks.length === 0) {
					logger.warn(
						`No tasks found for pull request with id: ${id} and number: ${number}`,
					);
					return { tasks: [] };
				}

				const { id: repoExternalId, ...repoRest } = repo;
				const { id: orgExternalId, ...orgRest } = org;

				logger.debug("Tasks found for pull request: ", tasks);

				await tx
					.insert(githubOrgTable)
					.values({
						...orgRest,
						externalId: orgExternalId,
						workspaceId: tasks[0].workspaceId,
					})
					.onConflictDoNothing();
				await tx
					.insert(githubRepoTable)
					.values({ ...repoRest, externalId: repoExternalId })
					.onConflictDoUpdate({
						target: githubRepoTable.externalId,
						set: { ...repoRest },
					});

				const [pull] = await tx
					.insert(githubPullRequestsTable)
					.values({
						externalId: id,
						number,
						state,
						title,
						url,
						branch,
						body,
						author,
						githubRepoInfoId: repo.id,
						timestamp: new Date(timestamp),
					})
					.onConflictDoUpdate({
						target: githubPullRequestsTable.externalId,
						set: { state, title, body },
					})
					.returning();

				const newTasks = await Promise.all(
					tasks.flatMap((task) =>
						tx
							.insert(githubPullRequestTaskTable)
							.values({ taskId: task.id, pullRequestId: pull.externalId })
							.onConflictDoNothing()
							.returning(),
					),
				).then((results) => results.flat().map((row) => row.taskId));

				return {
					tasks: tasks
						.filter(({ id }) => newTasks.includes(id))
						.map((task) => ({
							identifier: task.identifier,
							url: `/${task.workspaceUrl}/task/${task.identifier}/${formatUrl(task.title)}`,
							title: task.title,
						})),
				};
			});

			return c.superjson(tasks);
		}),
	mergePullRequest: baseProcedure
		.input(z.object({ pullRequestId: z.string() }))
		.mutation(async ({ input, ctx, c }) => {
			const { db, logger } = ctx;
			const { pullRequestId } = input;
			logger.info("Merging pull request with id: ", input.pullRequestId);
			await db.transaction(async (tx) => {
				// 1. Update the pull request state to "closed"
				await tx
					.update(githubPullRequestsTable)
					.set({ state: "closed" })
					.where(eq(githubPullRequestsTable.externalId, pullRequestId));

				// 2. Find all tasks associated with this pull request
				const tasksWithPullRequest = await tx
					.select({
						taskId: githubPullRequestTaskTable.taskId,
					})
					.from(githubPullRequestTaskTable)
					.where(eq(githubPullRequestTaskTable.pullRequestId, pullRequestId));

				const taskIds = tasksWithPullRequest.map((task) => task.taskId);

				if (taskIds.length === 0) {
					logger.warn(
						`No tasks found for pull request with id: ${pullRequestId}`,
					);
					return c.status(204);
				}

				// 3. Get tasks that are in "inReview" status
				const tasksInReview = await tx
					.select({
						id: tasksTable.id,
					})
					.from(tasksTable)
					.where(
						and(
							inArray(tasksTable.id, taskIds),
							eq(tasksTable.status, "inReview"),
						),
					);

				if (tasksInReview.length === 0) {
					logger.info(
						`No tasks in review found for pull request with id: ${pullRequestId}`,
					);
					return c.status(204);
				}

				// 4. For each task in review, check if all its associated PRs are closed
				const tasksToUpdate: string[] = [];

				for (const task of tasksInReview) {
					const associatedPRs = await tx
						.select({
							pullRequestId: githubPullRequestTaskTable.pullRequestId,
							state: githubPullRequestsTable.state,
						})
						.from(githubPullRequestTaskTable)
						.innerJoin(
							githubPullRequestsTable,
							eq(
								githubPullRequestTaskTable.pullRequestId,
								githubPullRequestsTable.externalId,
							),
						)
						.where(eq(githubPullRequestTaskTable.taskId, task.id));

					// Check if all PRs are closed
					const allPRsClosed = associatedPRs.every(
						(pr) => pr.state === "closed",
					);

					if (allPRsClosed) {
						tasksToUpdate.push(task.id);
					}
				}

				// 5. Update the tasks to "done" status
				if (tasksToUpdate.length > 0) {
					await tx
						.update(tasksTable)
						.set({ status: "done" })
						.where(inArray(tasksTable.id, tasksToUpdate));

					logger.info(`Updated ${tasksToUpdate.length} tasks to done status`);
				}
			});
			return c.status(204);
		}),
	closePullRequest: baseProcedure
		.input(z.object({ pullRequestId: z.string() }))
		.mutation(async ({ input, ctx, c }) => {
			const { db, logger } = ctx;
			const { pullRequestId } = input;
			logger.info("Closing pull request with id: ", input.pullRequestId);
			await db
				.update(githubPullRequestsTable)
				.set({ state: "closed" })
				.where(eq(githubPullRequestsTable.externalId, pullRequestId));
			return c.status(204);
		}),
	pushCommit: baseProcedure
		.input(
			z.object({
				id: z.string(),
				message: z.string(),
				url: z.string(),
				author: z.string(),
				repoId: z.string(),
				branch: z.string(),
				timestamp: z.string(),
			}),
		)
		.mutation(async ({ input, ctx, c }) => {
			const { db, logger } = ctx;
			const { id, message, url, author, repoId, branch, timestamp } = input;
			logger.info("Pushing commit with id: ", input.id);
			await db.transaction(async (tx) => {
				const [pull] = await tx
					.select({ externalId: githubPullRequestsTable.externalId })
					.from(githubPullRequestsTable)
					.where(eq(githubPullRequestsTable.branch, branch))
					.limit(1);
				if (!pull) {
					throw new HTTPException(404, {
						message: `Pull request with branch ${branch} not found`,
					});
				}

				await tx.insert(githubCommitsTable).values({
					externalId: id,
					message,
					url,
					author,
					repoId,
					pullId: pull.externalId,
					timestamp: new Date(timestamp),
				});
			});
			return c.status(204);
		}),
	uploadOrg: baseProcedure
		.input(
			z.object({
				id: z.string(),
				name: z.string(),
				description: z.string(),
				workspaceId: z.string(),
			}),
		)
		.mutation(async ({ input, ctx, c }) => {
			const { db, logger } = ctx;
			const { id, name, description, workspaceId } = input;
			logger.info("Uploading organization with id: ", input.id);
			await db.transaction(async (tx) => {
				await tx
					.insert(githubOrgTable)
					.values({
						externalId: id,
						name,
						description,
						workspaceId,
					})
					.onConflictDoNothing();
				return await tx
					.select({ slug: workspacesTable.url })
					.from(workspacesTable)
					.where(eq(workspacesTable.externalId, workspaceId))
					.then(([workspace]) => ({ slug: workspace.slug }));
			});
			return c.status(204);
		}),
});

const formatUrl = (title: string) => {
	const titleSlug = title
		.toLowerCase()
		.replace(/'/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
	return titleSlug;
};
